import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { promises as fs } from 'fs';

async function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  dotenv.config({ path: envPath });
}

async function analyzeNotaryCoverage() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get state-level counts
  const { data: stateCounts, error: stateError } = await supabase
    .from('notaries_new')
    .select('state')
    .not('state', 'is', null);

  if (stateError) {
    console.error('Error getting state counts:', stateError);
    return;
  }

  const stateDistribution: Record<string, number> = {};
  stateCounts?.forEach(row => {
    const state = row.state;
    stateDistribution[state] = (stateDistribution[state] || 0) + 1;
  });

  // Sort states by count
  const sortedStates = Object.entries(stateDistribution)
    .sort(([, a], [, b]) => b - a);

  console.log('\nNotary Distribution by State:');
  sortedStates.forEach(([state, count]) => {
    console.log(`${state}: ${count} notaries`);
  });

  // Check coverage in major metro areas
  const metroAreas = [
    // Northeast
    { name: 'NYC Metro', cities: ['New York', 'Newark', 'Jersey City', 'White Plains', 'Yonkers', 'Stamford'] },
    { name: 'Boston Metro', cities: ['Boston', 'Cambridge', 'Quincy', 'Waltham', 'Brookline'] },
    
    // West Coast
    { name: 'LA Metro', cities: ['Los Angeles', 'Long Beach', 'Santa Monica', 'Pasadena', 'Glendale', 'Burbank'] },
    { name: 'SF Bay Area', cities: ['San Francisco', 'San Jose', 'Oakland', 'Berkeley', 'Palo Alto'] },
    { name: 'Seattle Metro', cities: ['Seattle', 'Bellevue', 'Tacoma', 'Redmond', 'Kirkland'] },
    
    // South
    { name: 'Miami Metro', cities: ['Miami', 'Fort Lauderdale', 'Boca Raton', 'Hollywood', 'Pompano Beach'] },
    { name: 'Houston Metro', cities: ['Houston', 'The Woodlands', 'Sugar Land', 'Katy', 'Pearland'] },
    { name: 'Dallas Metro', cities: ['Dallas', 'Fort Worth', 'Arlington', 'Plano', 'Irving'] },
    
    // Midwest
    { name: 'Chicago Metro', cities: ['Chicago', 'Naperville', 'Evanston', 'Schaumburg', 'Oak Park'] },
    { name: 'Denver Metro', cities: ['Denver', 'Aurora', 'Lakewood', 'Centennial', 'Boulder'] }
  ];

  console.log('\nMetro Area Coverage:');
  for (const metro of metroAreas) {
    let totalCount = 0;
    for (const city of metro.cities) {
      const { count } = await supabase
        .from('notaries_new')
        .select('*', { count: 'exact' })
        .ilike('city', `%${city}%`);
      
      totalCount += count || 0;
    }
    console.log(`${metro.name}: ${totalCount} notaries`);
  }

  // Identify states with low coverage
  console.log('\nStates with Low Coverage (< 10 notaries):');
  sortedStates
    .filter(([, count]) => count < 10)
    .forEach(([state, count]) => {
      console.log(`${state}: ${count} notaries - Consider adding more cities in this state`);
    });
}

// Run the analysis
loadEnv()
  .then(analyzeNotaryCoverage)
  .catch(console.error); 