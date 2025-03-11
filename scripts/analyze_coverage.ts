import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { promises as fs } from 'fs';

async function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envFile = await fs.readFile(envPath, 'utf-8');
    dotenv.config({ path: envPath });
  } catch (error) {
    console.error('Error loading environment:', error);
  }
}

async function analyzeCoverage() {
  // Create Supabase client
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get total count
  const { data: totalCount } = await supabase
    .from('notaries_new')
    .select('id', { count: 'exact' });

  console.log(`\nTotal notaries in database: ${totalCount}`);

  // Get counts by city
  const { data: cityCounts } = await supabase
    .from('notaries_new')
    .select('city, state')
    .then(result => {
      const counts: { [key: string]: number } = {};
      result.data?.forEach(row => {
        const location = `${row.city}, ${row.state}`;
        counts[location] = (counts[location] || 0) + 1;
      });
      return {
        data: Object.entries(counts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 20)
      };
    });

  console.log('\nTop 20 cities by number of notaries:');
  cityCounts?.forEach(([location, count]) => {
    console.log(`${location}: ${count} notaries`);
  });

  // Analyze service types
  const { data: serviceTypes } = await supabase
    .from('notaries_new')
    .select(`
      service_types->is_mobile,
      service_types->is_24_hour,
      service_types->is_remote,
      service_types->offers_loan_signing,
      service_types->offers_apostille,
      service_types->offers_real_estate,
      service_types->offers_wedding,
      service_types->has_online_booking
    `);

  if (serviceTypes) {
    const serviceCounts = {
      mobile: 0,
      '24_hour': 0,
      remote: 0,
      loan_signing: 0,
      apostille: 0,
      real_estate: 0,
      wedding: 0,
      online_booking: 0
    };

    serviceTypes.forEach(notary => {
      if (notary.is_mobile) serviceCounts.mobile++;
      if (notary.is_24_hour) serviceCounts['24_hour']++;
      if (notary.is_remote) serviceCounts.remote++;
      if (notary.offers_loan_signing) serviceCounts.loan_signing++;
      if (notary.offers_apostille) serviceCounts.apostille++;
      if (notary.offers_real_estate) serviceCounts.real_estate++;
      if (notary.offers_wedding) serviceCounts.wedding++;
      if (notary.has_online_booking) serviceCounts.online_booking++;
    });

    console.log('\nService type distribution:');
    Object.entries(serviceCounts).forEach(([service, count]) => {
      const percentage = ((count / serviceTypes.length) * 100).toFixed(1);
      console.log(`${service.replace('_', ' ')}: ${count} (${percentage}%)`);
    });
  }

  // Get counts by state
  const { data: stateCounts } = await supabase
    .from('notaries_new')
    .select('state')
    .then(result => {
      const counts: { [key: string]: number } = {};
      result.data?.forEach(row => {
        counts[row.state] = (counts[row.state] || 0) + 1;
      });
      return {
        data: Object.entries(counts)
          .sort(([, a], [, b]) => b - a)
      };
    });

  console.log('\nCoverage by state:');
  stateCounts?.forEach(([state, count]) => {
    console.log(`${state}: ${count} notaries`);
  });
}

async function main() {
  await loadEnv();
  await analyzeCoverage();
}

main().catch(console.error); 