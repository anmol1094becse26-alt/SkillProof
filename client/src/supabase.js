import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wosrzuibwgtvulnrrhte.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Tg0HaEMWrcsSWGSZG6h6sw_zOcMJSdH';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Local cache keys to ensure smooth demo fallback if Postgres tables are empty/new
const LOCAL_STORAGE_PREFIX = 'skillproof_sb_cache_';

const getLocalCache = (key, defaultVal) => {
  try {
    const val = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setLocalCache = (key, val) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(val));
  } catch (e) {}
};

// Initial Seed Challenge Template (Used when creating initial challenges in Supabase)
export const SEED_CHALLENGES = [
  {
    id: 'chl_two_sum',
    title: 'Optimal Two-Sum & Hash Indexing',
    category: 'Algorithms',
    difficulty: 'Easy',
    duration: '25m',
    skills: ['Algorithms', 'Data Structures', 'Hash Maps', 'Time Complexity'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Must achieve strict O(n) runtime complexity.',
    starter_code: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
    test_cases: [
      { name: 'Standard positive array [2, 7, 11, 15], target 9', passed: true, time: '1.2ms' },
      { name: 'Duplicate elements [3, 2, 4], target 6', passed: true, time: '0.8ms' },
      { name: 'Large array benchmark (10,000 elements)', passed: true, time: '3.1ms' }
    ],
    created_by: 'system'
  },
  {
    id: 'chl_lru_cache',
    title: 'O(1) In-Memory LRU Cache',
    category: 'System Design',
    difficulty: 'Hard',
    duration: '45m',
    skills: ['System Design', 'Cache Algorithms', 'Doubly Linked Lists'],
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) time complexity for both get and put operations.',
    starter_code: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.cache.has(key)) this.cache.delete(key);\n    else if (this.cache.size >= this.capacity) {\n      this.cache.delete(this.cache.keys().next().value);\n    }\n    this.cache.set(key, value);\n  }\n}`,
    test_cases: [
      { name: 'Cache eviction on capacity boundary', passed: true, time: '1.5ms' },
      { name: 'Frequent key updates retain recency', passed: true, time: '1.1ms' },
      { name: 'O(1) get validation under 50,000 ops', passed: true, time: '4.8ms' }
    ],
    created_by: 'system'
  },
  {
    id: 'chl_token_bucket',
    title: 'Distributed Token Bucket Rate Limiter',
    category: 'Security',
    difficulty: 'Medium',
    duration: '35m',
    skills: ['Security', 'Distributed Systems', 'Rate Limiting', 'Concurrency'],
    description: 'Implement a thread-safe token bucket algorithm that restricts burst client requests to an assigned refill rate per second.',
    starter_code: `class TokenBucket {\n  constructor(capacity, refillRatePerSec) {\n    this.capacity = capacity;\n    this.tokens = capacity;\n    this.refillRate = refillRatePerSec;\n    this.lastRefill = Date.now();\n  }\n  consume(tokens = 1) {\n    this.refill();\n    if (this.tokens >= tokens) {\n      this.tokens -= tokens;\n      return true;\n    }\n    return false;\n  }\n  refill() {\n    const now = Date.now();\n    const elapsed = (now - this.lastRefill) / 1000;\n    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);\n    this.lastRefill = now;\n  }\n}`,
    test_cases: [
      { name: 'Allows requests below burst threshold', passed: true, time: '0.9ms' },
      { name: 'Drops request when bucket empty', passed: true, time: '0.7ms' },
      { name: 'Refills proportional to elapsed wall clock', passed: true, time: '1.4ms' }
    ],
    created_by: 'system'
  }
];

// ----------------- CHALLENGES API -----------------
export async function fetchChallenges() {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      setLocalCache('challenges', data);
      return { data, source: 'supabase' };
    }
  } catch (err) {
    console.warn('Supabase fetchChallenges fallback:', err);
  }

  // Return cached or empty
  const local = getLocalCache('challenges', []);
  return { data: local, source: 'local' };
}

export async function createChallenge(challenge) {
  const challengeWithMeta = {
    ...challenge,
    id: challenge.id || `chl_${Date.now()}`,
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('challenges')
      .insert([challengeWithMeta])
      .select()
      .single();

    if (!error && data) {
      const local = getLocalCache('challenges', []);
      setLocalCache('challenges', [data, ...local.filter(c => c.id !== data.id)]);
      return { data, error: null };
    }
  } catch (err) {
    console.warn('Supabase createChallenge error:', err);
  }

  // Local fallback
  const local = getLocalCache('challenges', []);
  const updated = [challengeWithMeta, ...local.filter(c => c.id !== challengeWithMeta.id)];
  setLocalCache('challenges', updated);
  return { data: challengeWithMeta, error: null };
}

// ----------------- SUBMISSIONS API -----------------
export async function fetchSubmissions(studentId = null) {
  try {
    let query = supabase.from('submissions').select('*').order('created_at', { ascending: false });
    if (studentId) {
      query = query.eq('student_id', studentId);
    }
    const { data, error } = await query;
    if (!error && data) {
      setLocalCache('submissions', data);
      return { data, source: 'supabase' };
    }
  } catch (err) {
    console.warn('Supabase fetchSubmissions fallback:', err);
  }

  const local = getLocalCache('submissions', []);
  const filtered = studentId ? local.filter(s => s.student_id === studentId) : local;
  return { data: filtered, source: 'local' };
}

export async function createSubmission(submissionData) {
  const newSubmission = {
    ...submissionData,
    id: submissionData.id || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('submissions')
      .insert([newSubmission])
      .select()
      .single();

    if (!error && data) {
      const local = getLocalCache('submissions', []);
      setLocalCache('submissions', [data, ...local]);
      return { data, error: null };
    }
  } catch (err) {
    console.warn('Supabase createSubmission fallback:', err);
  }

  const local = getLocalCache('submissions', []);
  setLocalCache('submissions', [newSubmission, ...local]);
  return { data: newSubmission, error: null };
}

// ----------------- SKILL PASSPORT API -----------------
export async function fetchPassport(identifier) {
  try {
    const { data, error } = await supabase
      .from('skill_passports')
      .select('*')
      .or(`student_id.eq.${identifier},id.eq.${identifier}`)
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return { data, error: null };
    }
  } catch (err) {
    console.warn('Supabase fetchPassport fallback:', err);
  }

  const localPassports = getLocalCache('passports', {});
  const local = localPassports[identifier] || null;
  return { data: local, error: null };
}

export async function upsertPassport(passportData) {
  try {
    const { data, error } = await supabase
      .from('skill_passports')
      .upsert([passportData], { onConflict: 'student_id' })
      .select()
      .single();

    if (!error && data) {
      const localPassports = getLocalCache('passports', {});
      localPassports[passportData.student_id] = data;
      localPassports[data.id] = data;
      setLocalCache('passports', localPassports);
      return { data, error: null };
    }
  } catch (err) {
    console.warn('Supabase upsertPassport fallback:', err);
  }

  const localPassports = getLocalCache('passports', {});
  localPassports[passportData.student_id] = passportData;
  localPassports[passportData.id] = passportData;
  setLocalCache('passports', localPassports);
  return { data: passportData, error: null };
}

// ----------------- CANDIDATES API -----------------
export async function fetchCandidates() {
  try {
    const { data: passports, error } = await supabase
      .from('skill_passports')
      .select('*')
      .order('trust_score', { ascending: false });

    if (!error && passports && passports.length > 0) {
      return { data: passports, source: 'supabase' };
    }
  } catch (err) {
    console.warn('Supabase fetchCandidates fallback:', err);
  }

  const localPassports = getLocalCache('passports', {});
  const list = Object.values(localPassports);
  return { data: list, source: 'local' };
}

// ----------------- INTERVIEW INVITES API -----------------
export async function fetchInterviewInvites(employerId = null) {
  try {
    let query = supabase.from('interview_invites').select('*').order('created_at', { ascending: false });
    if (employerId) {
      query = query.eq('employer_id', employerId);
    }
    const { data, error } = await query;
    if (!error && data) {
      setLocalCache('invites', data);
      return { data, source: 'supabase' };
    }
  } catch (err) {
    console.warn('Supabase fetchInterviewInvites fallback:', err);
  }

  const local = getLocalCache('invites', []);
  return { data: local, source: 'local' };
}

export async function sendInterviewInvite(invite) {
  const newInvite = {
    ...invite,
    id: invite.id || `inv_${Date.now()}`,
    status: 'Invited',
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('interview_invites')
      .insert([newInvite])
      .select()
      .single();

    if (!error && data) {
      const local = getLocalCache('invites', []);
      setLocalCache('invites', [data, ...local]);
      return { data, error: null };
    }
  } catch (err) {
    console.warn('Supabase sendInterviewInvite error:', err);
  }

  const local = getLocalCache('invites', []);
  setLocalCache('invites', [newInvite, ...local]);
  return { data: newInvite, error: null };
}

// ----------------- REALTIME SUBSCRIPTION HELPER -----------------
export function subscribeToTable(table, onInsert, onUpdate, onDelete) {
  try {
    const channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          if (payload.eventType === 'INSERT' && onInsert) onInsert(payload.new);
          if (payload.eventType === 'UPDATE' && onUpdate) onUpdate(payload.new);
          if (payload.eventType === 'DELETE' && onDelete) onDelete(payload.old);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn(`Realtime subscription error on ${table}:`, err);
    return () => {};
  }
}

// ----------------- SEED INITIAL CHALLENGES TO SUPABASE -----------------
export async function seedSupabaseWithInitialChallenges() {
  const results = [];
  for (const chl of SEED_CHALLENGES) {
    const res = await createChallenge(chl);
    results.push(res);
  }
  return results;
}
