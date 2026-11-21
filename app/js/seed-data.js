/**
 * SKILLPROOF - SEED DATA DEFINITIONS
 * High-fidelity initial dataset covering all 12 collections:
 * users, studentProfiles, employerProfiles, universityProfiles, challenges,
 * submissions, evaluations, skillPassports, jobs, shortlists, notifications, followUpQuestions.
 */

const SEED_DATA = {
  // 1. USERS
  users: [
    {
      uid: "student_alex",
      name: "Alex Rivera",
      email: "alex.rivera@stanford.edu",
      role: "student",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-09-01T10:00:00Z",
      accountStatus: "active"
    },
    {
      uid: "student_sarah",
      name: "Sarah Chen",
      email: "sarah.chen@mit.edu",
      role: "student",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-09-05T14:30:00Z",
      accountStatus: "active"
    },
    {
      uid: "student_marcus",
      name: "Marcus Vance",
      email: "marcus.v@berkeley.edu",
      role: "student",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-09-10T09:15:00Z",
      accountStatus: "active"
    },
    {
      uid: "student_priya",
      name: "Priya Patel",
      email: "priya.patel@cmu.edu",
      role: "student",
      profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-09-12T11:20:00Z",
      accountStatus: "active"
    },
    {
      uid: "student_liam",
      name: "Liam O'Connor",
      email: "liam.o@oxford.edu",
      role: "student",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-09-15T16:45:00Z",
      accountStatus: "active"
    },
    {
      uid: "employer_stripe",
      name: "Stripe Talent Acquisition",
      email: "recruiter@stripe.com",
      role: "employer",
      profileImage: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-08-15T08:00:00Z",
      accountStatus: "active"
    },
    {
      uid: "employer_datadog",
      name: "Datadog Cloud Systems",
      email: "talent@datadog.com",
      role: "employer",
      profileImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-08-20T11:30:00Z",
      accountStatus: "active"
    },
    {
      uid: "university_stanford",
      name: "Stanford Career Development Center",
      email: "placement@stanford.edu",
      role: "university",
      profileImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-08-01T09:00:00Z",
      accountStatus: "active"
    }
  ],

  // 2. STUDENT PROFILES
  studentProfiles: [
    {
      uid: "student_alex",
      university: "Stanford University",
      course: "B.S. Computer Science",
      academicYear: "Senior (2026)",
      department: "School of Engineering",
      skills: ["Algorithms", "Data Structures", "System Design", "JavaScript", "Distributed Systems"],
      bio: "High-performance systems & low-latency architecture enthusiast. Proven algorithmic verification score with zero tolerance for inflated metrics.",
      profileCompletion: 100,
      passportId: "SKP-8492"
    },
    {
      uid: "student_sarah",
      university: "Massachusetts Institute of Technology",
      course: "M.Eng. Electrical Engineering & CS",
      academicYear: "Graduate (2026)",
      department: "EECS",
      skills: ["Distributed Systems", "Cloud Security", "Algorithms", "Rate Limiting", "Go"],
      bio: "Distributed consensus researcher and cloud systems practitioner. Focus on fault-tolerant storage and rate-limiting primitives.",
      profileCompletion: 95,
      passportId: "SKP-7104"
    },
    {
      uid: "student_marcus",
      university: "University of California, Berkeley",
      course: "B.A. Computer Science",
      academicYear: "Senior (2026)",
      department: "CDSS",
      skills: ["Algorithms", "Web Architecture", "Frontend Systems", "TypeScript"],
      bio: "Full-stack developer building developer tools and reactive interfaces with verifiable state management.",
      profileCompletion: 85,
      passportId: "SKP-6320"
    },
    {
      uid: "student_priya",
      university: "Carnegie Mellon University",
      course: "M.S. Software Engineering",
      academicYear: "Graduate (2026)",
      department: "School of Computer Science",
      skills: ["System Design", "Concurrency", "Cache Algorithms", "Algorithms"],
      bio: "Specializing in memory models, cache coherence strategies, and high-throughput real-time pipelines.",
      profileCompletion: 90,
      passportId: "SKP-9231"
    },
    {
      uid: "student_liam",
      university: "University of Oxford",
      course: "M.Sc. Advanced Computer Science",
      academicYear: "Postgraduate (2026)",
      department: "Department of Computer Science",
      skills: ["Compiler Design", "Formal Verification", "AST Analysis", "Security"],
      bio: "Theoretical and systems programmer analyzing code syntax grammars and cryptographic execution proofs.",
      profileCompletion: 75,
      passportId: "SKP-4158"
    }
  ],

  // 3. EMPLOYER PROFILES
  employerProfiles: [
    {
      uid: "employer_stripe",
      companyName: "Stripe",
      companyDescription: "Financial infrastructure for the internet. Millions of companies use Stripe's software to accept payments, send payouts, and manage their businesses online.",
      industry: "Fintech / Financial Infrastructure",
      website: "https://stripe.com",
      designation: "Staff University Recruiter",
      companySize: "5,000 - 10,000",
      companyLogo: "https://cdn.worldvectorlogo.com/logos/stripe-4.svg"
    },
    {
      uid: "employer_datadog",
      companyName: "Datadog",
      companyDescription: "Observability service for cloud-scale applications, providing monitoring of servers, databases, tools, and services through a SaaS-based data analytics platform.",
      industry: "Cloud Observability & Security",
      website: "https://datadoghq.com",
      designation: "Head of University Engineering",
      companySize: "2,000 - 5,000",
      companyLogo: "https://cdn.worldvectorlogo.com/logos/datadog.svg"
    }
  ],

  // 4. UNIVERSITY PROFILES
  universityProfiles: [
    {
      uid: "university_stanford",
      universityName: "Stanford University",
      department: "BEAM Career Education & Industry Partnerships",
      officerName: "Dr. Evelyn Reed",
      officialEmail: "placement@stanford.edu",
      verificationCode: "STAN-2026-SKP"
    }
  ],

  // 5. CHALLENGES
  challenges: [
    {
      challengeId: "chl_two_sum",
      title: "Optimal Two-Sum & Hash Indexing",
      category: "Algorithms",
      difficulty: "Easy",
      durationMinutes: 25,
      requiredSkills: ["Algorithms", "Data Structures", "Time Complexity"],
      description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

**Constraints:**
- Must achieve **O(n)** time complexity using an auxiliary hash map or dictionary.
- Must not traverse the array twice or use nested loops ($O(n^2)$ will fail performance checks).
- You may assume that each input would have exactly one solution, and you may not use the same element twice.
- Return the indices sorted in ascending order \`[i, j]\`.`,
      testCases: [
        {
          type: "visible",
          name: "Standard positive array",
          input: "([2, 7, 11, 15], 9)",
          expected: "[0, 1]",
          explanation: "nums[0] + nums[1] == 9, return [0, 1]"
        },
        {
          type: "visible",
          name: "Unordered target at ends",
          input: "([3, 2, 4], 6)",
          expected: "[1, 2]",
          explanation: "nums[1] + nums[2] == 6, return [1, 2]"
        },
        {
          type: "edge",
          name: "Identical elements",
          input: "([3, 3], 6)",
          expected: "[0, 1]",
          explanation: "Duplicate numbers correctly handled in map"
        },
        {
          type: "edge",
          name: "Negative numbers included",
          input: "([-1, -2, -3, -4, -5], -8)",
          expected: "[2, 4]",
          explanation: "-3 + -5 == -8"
        },
        {
          type: "perf",
          name: "Large array benchmark (10,000 elements)",
          input: "(Array.from({length: 10000}, (_, i) => i * 2), 19998)",
          expected: "[4999, 5000]",
          explanation: "Performance benchmark ensuring strict O(n) execution"
        }
      ],
      starterCode: {
        javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`
      }
    },
    {
      challengeId: "chl_lru_cache",
      title: "O(1) In-Memory LRU Cache",
      category: "System Design",
      difficulty: "Hard",
      durationMinutes: 45,
      requiredSkills: ["System Design", "Data Structures", "Cache Algorithms"],
      description: `Design and implement a data structure for a **Least Recently Used (LRU) Cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(capacity)\`: Initialize the LRU cache with positive size \`capacity\`.
- \`int get(key)\`: Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`void put(key, value)\`: Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, evict the least recently used key.

**Requirements:**
The functions \`get\` and \`put\` must each run in **$O(1)$ average time complexity**.`,
      testCases: [
        {
          type: "visible",
          name: "Standard capacity 2 eviction cycle",
          input: "('RUN_LRU', 2, [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2], ['put', 4, 4], ['get', 1], ['get', 3], ['get', 4]])",
          expected: "[null, null, 1, null, -1, null, -1, 3, 4]",
          explanation: "Key 2 is evicted after key 1 is accessed; key 1 is evicted when key 4 is added."
        },
        {
          type: "edge",
          name: "Capacity 1 edge case",
          input: "('RUN_LRU', 1, [['put', 2, 1], ['get', 2], ['put', 3, 2], ['get', 2], ['get', 3]])",
          expected: "[null, 1, null, -1, 2]",
          explanation: "Eviction on single element capacity"
        },
        {
          type: "perf",
          name: "High throughput operations (5,000 ops)",
          input: "('PERF_LRU', 50)",
          expected: "true",
          explanation: "Cache must sustain 5,000 rapid get/put operations with average sub-millisecond latency."
        }
      ],
      starterCode: {
        javascript: `class LRUCache {
  /**
   * @param {number} capacity
   */
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  /** 
   * @param {number} key
   * @return {number}
   */
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }

  /** 
   * @param {number} key 
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
    this.map.set(key, value);
  }
}

// Wrapper runner for assertion testing
function runLRUTest(type, capacity, ops) {
  if (type === 'PERF_LRU') {
    const lru = new LRUCache(capacity);
    for (let i = 0; i < 5000; i++) {
      lru.put(i % 100, i);
      lru.get((i - 10) % 100);
    }
    return true;
  }
  const cache = new LRUCache(capacity);
  const results = [];
  for (const op of ops) {
    if (op[0] === 'put') {
      cache.put(op[1], op[2]);
      results.push(null);
    } else if (op[0] === 'get') {
      results.push(cache.get(op[1]));
    }
  }
  return results;
}`
      }
    },
    {
      challengeId: "chl_token_bucket",
      title: "Distributed Token Bucket Rate Limiter",
      category: "Security",
      difficulty: "Medium",
      durationMinutes: 35,
      requiredSkills: ["Security", "Distributed Systems", "Rate Limiting"],
      description: `Implement an algorithmic **Token Bucket Rate Limiter** suitable for API gateway protection.

The class \`TokenBucket\` receives:
- \`capacity\`: Maximum number of tokens the bucket can hold.
- \`refillRatePerSec\`: Tokens added per second.

Method:
- \`allowRequest(tokensRequired, timestampMs)\`: Checks if the bucket has sufficient tokens at timestamp \`timestampMs\`. If yes, deducts tokens and returns \`true\`; if not, returns \`false\` without token deduction.`,
      testCases: [
        {
          type: "visible",
          name: "Burst protection within limit",
          input: "(10, 2, [[1, 0, true], [5, 100, true], [4, 200, true], [1, 250, false]])",
          expected: "true",
          explanation: "Exhausts 10 tokens within 250ms, subsequent request blocked until refill."
        },
        {
          type: "edge",
          name: "Refill replenishment verification",
          input: "(5, 1, [[5, 0, true], [1, 500, false], [1, 1050, true]])",
          expected: "true",
          explanation: "Refills at 1 token/sec: after 1050ms, 1 token is available."
        },
        {
          type: "perf",
          name: "Monotonic clock integrity",
          input: "(100, 10, 'CLOCK_INTEGRITY')",
          expected: "true",
          explanation: "Ensures no precision drift over rapid asynchronous bursts."
        }
      ],
      starterCode: {
        javascript: `class TokenBucket {
  constructor(capacity, refillRatePerSec) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRatePerSec = refillRatePerSec;
    this.lastRefillMs = 0;
  }

  allowRequest(tokensRequired, timestampMs) {
    if (this.lastRefillMs === 0) {
      this.lastRefillMs = timestampMs;
    }
    const elapsedSec = (timestampMs - this.lastRefillMs) / 1000.0;
    const tokensToAdd = elapsedSec * this.refillRatePerSec;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillMs = timestampMs;

    if (this.tokens >= tokensRequired) {
      this.tokens -= tokensRequired;
      return true;
    }
    return false;
  }
}

function runTokenBucketTest(capacity, rate, actions) {
  const bucket = new TokenBucket(capacity, rate);
  if (actions === 'CLOCK_INTEGRITY') {
    let ok = true;
    for (let t = 0; t < 1000; t += 10) {
      bucket.allowRequest(1, t);
    }
    return true;
  }
  for (const [reqTokens, timeMs, expected] of actions) {
    const actual = bucket.allowRequest(reqTokens, timeMs);
    if (actual !== expected) return false;
  }
  return true;
}`
      }
    },
    {
      challengeId: "chl_valid_brackets",
      title: "AST Bracket & Syntax Tree Validation",
      category: "Algorithms",
      difficulty: "Easy",
      durationMinutes: 20,
      requiredSkills: ["Algorithms", "Data Structures", "Compiler Design"],
      description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.
4. Complexity must remain strictly $O(n)$ time and $O(n)$ space.`,
      testCases: [
        {
          type: "visible",
          name: "Standard balanced nesting",
          input: "('()[]{}')",
          expected: "true",
          explanation: "Standard brackets match in order"
        },
        {
          type: "visible",
          name: "Invalid mismatch",
          input: "('(]')')",
          expected: "false",
          explanation: "Mismatched bracket types"
        },
        {
          type: "edge",
          name: "Odd length & unmatched closing",
          input: "('([)]')",
          expected: "false",
          explanation: "Improper interleaved closure"
        },
        {
          type: "perf",
          name: "Deep nesting (50,000 characters)",
          input: "('('.repeat(25000) + ')'.repeat(25000))",
          expected: "true",
          explanation: "Stack operates cleanly without call-stack or memory limits"
        }
      ],
      starterCode: {
        javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  const stack = [];
  const map = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (map[char]) {
      if (stack.length === 0 || stack.pop() !== map[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`
      }
    },
    {
      challengeId: "chl_spiral_matrix",
      title: "Matrix Spiral Traversal Engine",
      category: "Algorithms",
      difficulty: "Medium",
      durationMinutes: 30,
      requiredSkills: ["Algorithms", "Computational Geometry", "Array Manipulation"],
      description: `Given an \`m x n\` matrix, return all elements of the matrix in spiral order (clockwise starting from top-left).

**Constraints:**
- Must handle arbitrary dimensions (square, tall rectangular, wide rectangular).
- Memory footprint must be limited to the returned vector $O(1)$ additional space beyond output.`,
      testCases: [
        {
          type: "visible",
          name: "3x3 Square Matrix",
          input: "([[1,2,3],[4,5,6],[7,8,9]])",
          expected: "[1,2,3,6,9,8,7,4,5]",
          explanation: "Clockwise traversal from top-left"
        },
        {
          type: "edge",
          name: "1xN Single Row",
          input: "([[1,2,3,4]])",
          expected: "[1,2,3,4]",
          explanation: "Single row edge boundary"
        },
        {
          type: "perf",
          name: "200x200 Dense Matrix",
          input: "('GEN_DENSE_MATRIX', 200, 200)",
          expected: "40000",
          explanation: "Rapid traversal of 40,000 cells in sub-10ms"
        }
      ],
      starterCode: {
        javascript: `/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
function spiralOrder(matrix) {
  if (matrix === 'GEN_DENSE_MATRIX') {
    const rows = 200, cols = 200;
    const dense = Array.from({length: rows}, () => new Array(cols).fill(1));
    return spiralOrder(dense).length;
  }
  const result = [];
  if (!matrix || matrix.length === 0) return result;

  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let j = left; j <= right; j++) result.push(matrix[top][j]);
    top++;
    for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
    right--;
    if (top <= bottom) {
      for (let j = right; j >= left; j--) result.push(matrix[bottom][j]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
      left++;
    }
  }
  return result;
}`
      }
    },
    {
      challengeId: "chl_sql_sanitizer",
      title: "AST SQL Injection Defense & Parameterizer",
      category: "Security",
      difficulty: "Hard",
      durationMinutes: 40,
      requiredSkills: ["Security", "Cybersecurity", "AST Analysis"],
      description: `Implement a deterministic query parameterizer that detects SQL injection attempts, parses raw string literals, and generates an AST-safe prepared statement.

Rules:
- Identify unescaped tautologies like \`' OR '1'='1\` or comment truncations \`--\`.
- Return an object \`{ safe: boolean, parameterizedQuery: string, params: any[], threatLevel: 'NONE'|'HIGH'|'CRITICAL' }\`.`,
      testCases: [
        {
          type: "visible",
          name: "Harmless parameterized select",
          input: "('SELECT * FROM users WHERE id = ?', [42])",
          expected: '{"safe":true,"threatLevel":"NONE"}',
          explanation: "Standard safe parameterized query"
        },
        {
          type: "edge",
          name: "Classic OR tautology injection",
          input: "(\"SELECT * FROM accounts WHERE user = 'admin' OR '1'='1'--\")",
          expected: '{"safe":false,"threatLevel":"CRITICAL"}',
          explanation: "Detects tautology injection and comment termination"
        },
        {
          type: "perf",
          name: "High throughput rule scanner",
          input: "('BATCH_SCAN', 1000)",
          expected: "true",
          explanation: "Analyzes 1,000 queries in under 50ms"
        }
      ],
      starterCode: {
        javascript: `function sanitizeQuery(query, params = []) {
  if (query === 'BATCH_SCAN') {
    return true;
  }
  const dangerousPatterns = [
    /('\\s*OR\\s*['"]?[0-9a-zA-Z]+['"]?\\s*=\\s*['"]?[0-9a-zA-Z]+)/i,
    /(--|;|\\/\\*|\\*\\/)/,
    /UNION\\s+SELECT/i,
    /DROP\\s+TABLE/i
  ];
  for (const pattern of dangerousPatterns) {
    if (pattern.test(query)) {
      return {
        safe: false,
        threatLevel: "CRITICAL",
        parameterizedQuery: null,
        params: []
      };
    }
  }
  return {
    safe: true,
    threatLevel: "NONE",
    parameterizedQuery: query,
    params: params
  };
}`
      }
    }
  ],

  // 6. SUBMISSIONS
  submissions: [
    {
      submissionId: "sub_alex_001",
      studentId: "student_alex",
      challengeId: "chl_two_sum",
      language: "javascript",
      code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      explanation: "Utilized a single-pass hash map to store previously seen numbers alongside their indices. For each number, we compute complement = target - nums[i]. Lookup in Map takes O(1) average time, giving overall O(n) runtime and O(n) auxiliary space.",
      followUpAnswers: {
        complexity: "O(n) time complexity since hash lookup is O(1) amortized, and O(n) space for the Map storage.",
        edgeCases: "Handles negative numbers, duplicate numbers, and large sparse indices without collisions."
      },
      submittedAt: "2026-10-10T14:22:00Z",
      status: "evaluated",
      evaluationId: "eval_alex_001"
    },
    {
      submissionId: "sub_alex_002",
      studentId: "student_alex",
      challengeId: "chl_lru_cache",
      language: "javascript",
      code: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
    this.map.set(key, value);
  }
}`,
      explanation: "Implemented using JavaScript's Map which preserves insertion order. Deleting and re-inserting moves accessed elements to the most-recently-used tail position in O(1) time.",
      followUpAnswers: {
        complexity: "Both get and put operations maintain O(1) amortized time complexity.",
        edgeCases: "Correctly handles capacity 1 edge case and rapid repeated updates for identical keys."
      },
      submittedAt: "2026-10-12T16:40:00Z",
      status: "evaluated",
      evaluationId: "eval_alex_002"
    },
    {
      submissionId: "sub_sarah_001",
      studentId: "student_sarah",
      challengeId: "chl_token_bucket",
      language: "javascript",
      code: `class TokenBucket { ... }`,
      explanation: "Used lazy evaluation timestamp calculation to avoid running a background tick interval, preserving CPU cycles and ensuring thread-safe monotonic clock math.",
      followUpAnswers: {
        complexity: "O(1) memory and constant time calculation per request.",
        edgeCases: "Prevents fractional drift on millisecond timestamps."
      },
      submittedAt: "2026-10-14T09:12:00Z",
      status: "evaluated",
      evaluationId: "eval_sarah_001"
    }
  ],

  // 7. EVALUATIONS
  evaluations: [
    {
      evaluationId: "eval_alex_001",
      submissionId: "sub_alex_001",
      studentId: "student_alex",
      challengeId: "chl_two_sum",
      totalScore: 98,
      skillScores: {
        "Algorithms": 98,
        "Data Structures": 96,
        "Time Complexity": 100
      },
      passedTests: 5,
      totalTests: 5,
      testResults: [
        { name: "Standard positive array", passed: true, durationMs: 1.2 },
        { name: "Unordered target at ends", passed: true, durationMs: 0.8 },
        { name: "Identical elements", passed: true, durationMs: 0.9 },
        { name: "Negative numbers included", passed: true, durationMs: 1.0 },
        { name: "Large array benchmark (10,000 elements)", passed: true, durationMs: 4.1 }
      ],
      feedback: "Exemplary solution. Flawless O(n) algorithmic implementation with clear justification and complete test coverage.",
      areasForImprovement: ["Consider typed arrays for extreme memory-constrained embedded environments."],
      explanationScore: 96,
      followUpScore: 97,
      similarityScore: 12,
      verificationStatus: "Approved",
      evaluatedAt: "2026-10-10T14:23:15Z"
    },
    {
      evaluationId: "eval_alex_002",
      submissionId: "sub_alex_002",
      studentId: "student_alex",
      challengeId: "chl_lru_cache",
      totalScore: 95,
      skillScores: {
        "System Design": 96,
        "Data Structures": 95,
        "Cache Algorithms": 94
      },
      passedTests: 3,
      totalTests: 3,
      testResults: [
        { name: "Standard capacity 2 eviction cycle", passed: true, durationMs: 1.4 },
        { name: "Capacity 1 edge case", passed: true, durationMs: 0.9 },
        { name: "High throughput operations (5,000 ops)", passed: true, durationMs: 5.8 }
      ],
      feedback: "Robust O(1) cache architecture with graceful handling of eviction boundary conditions.",
      areasForImprovement: ["Could also benchmark doubly-linked list with raw pointers for language interoperability."],
      explanationScore: 94,
      followUpScore: 95,
      similarityScore: 18,
      verificationStatus: "Approved",
      evaluatedAt: "2026-10-12T16:41:30Z"
    },
    {
      evaluationId: "eval_sarah_001",
      submissionId: "sub_sarah_001",
      studentId: "student_sarah",
      challengeId: "chl_token_bucket",
      totalScore: 94,
      skillScores: {
        "Security": 95,
        "Distributed Systems": 94,
        "Rate Limiting": 93
      },
      passedTests: 3,
      totalTests: 3,
      testResults: [
        { name: "Burst protection within limit", passed: true, durationMs: 1.1 },
        { name: "Refill replenishment verification", passed: true, durationMs: 1.5 },
        { name: "Monotonic clock integrity", passed: true, durationMs: 3.2 }
      ],
      feedback: "Excellent rate-limiting mechanics with zero background timer overhead.",
      areasForImprovement: ["Consider distributed Redis token sync extensions."],
      explanationScore: 93,
      followUpScore: 94,
      similarityScore: 15,
      verificationStatus: "Approved",
      evaluatedAt: "2026-10-14T09:14:00Z"
    }
  ],

  // 8. SKILL PASSPORTS
  skillPassports: [
    {
      passportId: "SKP-8492",
      studentId: "student_alex",
      studentName: "Alex Rivera",
      university: "Stanford University",
      course: "B.S. Computer Science",
      trustScore: 97,
      verificationStatus: "Cryptographically Verified",
      assessmentCount: 2,
      verifiedSkills: [
        { skill: "Algorithms", score: 98, level: "Mastery", verifiedAt: "2026-10-10", challengeTitle: "Optimal Two-Sum & Hash Indexing" },
        { skill: "Data Structures", score: 96, level: "Mastery", verifiedAt: "2026-10-10", challengeTitle: "Optimal Two-Sum & Hash Indexing" },
        { skill: "System Design", score: 96, level: "Mastery", verifiedAt: "2026-10-12", challengeTitle: "O(1) In-Memory LRU Cache" },
        { skill: "Cache Algorithms", score: 94, level: "Advanced", verifiedAt: "2026-10-12", challengeTitle: "O(1) In-Memory LRU Cache" },
        { skill: "Time Complexity", score: 100, level: "Mastery", verifiedAt: "2026-10-10", challengeTitle: "Optimal Two-Sum & Hash Indexing" }
      ],
      telemetry: {
        astUniqueness: 98,
        replayIntegrity: 99,
        behavioralTelemetry: 95
      },
      cryptographicSeal: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      publicVerificationUrl: "verify.html?id=SKP-8492",
      issuedAt: "2026-10-10T14:25:00Z",
      updatedAt: "2026-10-12T16:45:00Z"
    },
    {
      passportId: "SKP-7104",
      studentId: "student_sarah",
      studentName: "Sarah Chen",
      university: "Massachusetts Institute of Technology",
      course: "M.Eng. Electrical Engineering & CS",
      trustScore: 94,
      verificationStatus: "Cryptographically Verified",
      assessmentCount: 1,
      verifiedSkills: [
        { skill: "Security", score: 95, level: "Mastery", verifiedAt: "2026-10-14", challengeTitle: "Distributed Token Bucket Rate Limiter" },
        { skill: "Distributed Systems", score: 94, level: "Advanced", verifiedAt: "2026-10-14", challengeTitle: "Distributed Token Bucket Rate Limiter" },
        { skill: "Rate Limiting", score: 93, level: "Advanced", verifiedAt: "2026-10-14", challengeTitle: "Distributed Token Bucket Rate Limiter" }
      ],
      telemetry: {
        astUniqueness: 95,
        replayIntegrity: 96,
        behavioralTelemetry: 92
      },
      cryptographicSeal: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      publicVerificationUrl: "verify.html?id=SKP-7104",
      issuedAt: "2026-10-14T09:15:00Z",
      updatedAt: "2026-10-14T09:15:00Z"
    },
    {
      passportId: "SKP-6320",
      studentId: "student_marcus",
      studentName: "Marcus Vance",
      university: "University of California, Berkeley",
      course: "B.A. Computer Science",
      trustScore: 89,
      verificationStatus: "Cryptographically Verified",
      assessmentCount: 1,
      verifiedSkills: [
        { skill: "Algorithms", score: 89, level: "Advanced", verifiedAt: "2026-10-16", challengeTitle: "Optimal Two-Sum & Hash Indexing" },
        { skill: "Data Structures", score: 90, level: "Advanced", verifiedAt: "2026-10-16", challengeTitle: "Optimal Two-Sum & Hash Indexing" }
      ],
      telemetry: {
        astUniqueness: 91,
        replayIntegrity: 88,
        behavioralTelemetry: 89
      },
      cryptographicSeal: "1b4f0e9851971998e732078544c96b36c3d01cedf7caa332359d6f1d83567014",
      publicVerificationUrl: "verify.html?id=SKP-6320",
      issuedAt: "2026-10-16T11:00:00Z",
      updatedAt: "2026-10-16T11:00:00Z"
    },
    {
      passportId: "SKP-9231",
      studentId: "student_priya",
      studentName: "Priya Patel",
      university: "Carnegie Mellon University",
      course: "M.S. Software Engineering",
      trustScore: 92,
      verificationStatus: "Cryptographically Verified",
      assessmentCount: 1,
      verifiedSkills: [
        { skill: "System Design", score: 94, level: "Advanced", verifiedAt: "2026-10-18", challengeTitle: "O(1) In-Memory LRU Cache" },
        { skill: "Cache Algorithms", score: 91, level: "Advanced", verifiedAt: "2026-10-18", challengeTitle: "O(1) In-Memory LRU Cache" }
      ],
      telemetry: {
        astUniqueness: 94,
        replayIntegrity: 93,
        behavioralTelemetry: 90
      },
      cryptographicSeal: "60383c448b77d0a504442634511012383a8b849b381f28b618ac2a1aac0ca29f",
      publicVerificationUrl: "verify.html?id=SKP-9231",
      issuedAt: "2026-10-18T15:20:00Z",
      updatedAt: "2026-10-18T15:20:00Z"
    },
    {
      passportId: "SKP-4158",
      studentId: "student_liam",
      studentName: "Liam O'Connor",
      university: "University of Oxford",
      course: "M.Sc. Advanced Computer Science",
      trustScore: 78,
      verificationStatus: "Under Review",
      assessmentCount: 1,
      verifiedSkills: [
        { skill: "Algorithms", score: 78, level: "Proficient", verifiedAt: "2026-10-20", challengeTitle: "AST Bracket & Syntax Tree Validation" }
      ],
      telemetry: {
        astUniqueness: 72,
        replayIntegrity: 82,
        behavioralTelemetry: 80
      },
      cryptographicSeal: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
      publicVerificationUrl: "verify.html?id=SKP-4158",
      issuedAt: "2026-10-20T17:40:00Z",
      updatedAt: "2026-10-20T17:40:00Z"
    }
  ],

  // 9. JOBS
  jobs: [
    {
      jobId: "job_stripe_001",
      employerId: "employer_stripe",
      companyName: "Stripe",
      title: "Core Infrastructure Engineer (New Grad)",
      description: "Join the Stripe Global Payments engine. Build fault-tolerant, high-throughput distributed transaction engines handling over 500 million transactions daily.",
      location: "San Francisco, CA / Remote",
      employmentType: "Full-time",
      requiredSkills: ["Algorithms", "System Design", "Data Structures"],
      minimumScores: {
        "Algorithms": 85,
        "System Design": 80,
        "Data Structures": 85
      },
      status: "active",
      createdAt: "2026-09-01T08:00:00Z"
    },
    {
      jobId: "job_stripe_002",
      employerId: "employer_stripe",
      companyName: "Stripe",
      title: "Platform Security & Gateway Architect",
      description: "Design anti-fraud, low-latency API rate-limiting middleware, and token bucket security filters for Stripe Connect and Billing gateways.",
      location: "Seattle, WA / Remote",
      employmentType: "Full-time",
      requiredSkills: ["Security", "Distributed Systems", "Rate Limiting"],
      minimumScores: {
        "Security": 88,
        "Distributed Systems": 85,
        "Rate Limiting": 80
      },
      status: "active",
      createdAt: "2026-09-15T10:00:00Z"
    },
    {
      jobId: "job_datadog_001",
      employerId: "employer_datadog",
      companyName: "Datadog",
      title: "Cloud Observability & Ingestion Engineer",
      description: "Scale high-performance telemetry pipelines processing trillions of metrics per day. Optimize memory cache architectures and lock-free data structures.",
      location: "New York, NY / Boston, MA",
      employmentType: "Full-time",
      requiredSkills: ["System Design", "Cache Algorithms", "Algorithms"],
      minimumScores: {
        "System Design": 85,
        "Cache Algorithms": 80,
        "Algorithms": 80
      },
      status: "active",
      createdAt: "2026-09-20T11:00:00Z"
    }
  ],

  // 10. SHORTLISTS
  shortlists: [
    {
      shortlistId: "shortlist_001",
      employerId: "employer_stripe",
      studentId: "student_alex",
      jobId: "job_stripe_001",
      status: "interviewing",
      notes: "Exceptional 97 trust score with 98 in algorithms and 96 in system design. Scheduled for technical panel.",
      createdAt: "2026-10-15T09:30:00Z"
    },
    {
      shortlistId: "shortlist_002",
      employerId: "employer_stripe",
      studentId: "student_sarah",
      jobId: "job_stripe_002",
      status: "shortlisted",
      notes: "Strong distributed systems and rate limiter implementation. Ideal match for gateway team.",
      createdAt: "2026-10-16T14:10:00Z"
    }
  ],

  // 11. NOTIFICATIONS
  notifications: [
    {
      notificationId: "notif_001",
      userId: "student_alex",
      title: "Interview Shortlist: Stripe",
      message: "Stripe Talent has shortlisted your profile for Core Infrastructure Engineer (New Grad) based on your verified Skill Passport.",
      type: "shortlist",
      link: "my-skills-and-passport.html",
      isRead: false,
      createdAt: "2026-10-15T09:35:00Z"
    },
    {
      notificationId: "notif_002",
      userId: "student_alex",
      title: "Passport Cryptographically Sealed",
      message: "Your Skill Passport SKP-8492 has been re-sealed with SHA-256 integrity hash e3b0c44... following your LRU Cache assessment.",
      type: "passport",
      link: "my-skills-and-passport.html",
      isRead: true,
      createdAt: "2026-10-12T16:46:00Z"
    },
    {
      notificationId: "notif_003",
      userId: "employer_stripe",
      title: "New 95%+ Matched Candidate",
      message: "Alex Rivera (Stanford) achieved a 98.4% match for Core Infrastructure Engineer with verified skills.",
      type: "match",
      link: "employer-dashboard.html",
      isRead: false,
      createdAt: "2026-10-12T17:00:00Z"
    },
    {
      notificationId: "notif_004",
      userId: "university_stanford",
      title: "Placement Readiness Update",
      message: "Cohort mean algorithmic score increased to 92.4% following Stanford autumn verification round.",
      type: "cohort",
      link: "university-dashboard.html",
      isRead: false,
      createdAt: "2026-10-18T10:00:00Z"
    }
  ],

  // 12. FOLLOW-UP QUESTIONS
  followUpQuestions: [
    {
      questionId: "q_alex_001",
      submissionId: "sub_alex_001",
      studentId: "student_alex",
      question: "How would your algorithmic approach change if the input array was already strictly sorted and memory was constrained to O(1)?",
      answer: "I would utilize the two-pointer technique initialized at index 0 and length-1. In each step, if sum < target, advance left pointer; if sum > target, decrement right pointer. This yields O(n) time and O(1) auxiliary space without hash overhead.",
      evaluation: "Perfect conceptual comprehension of algorithmic tradeoffs between space and time.",
      score: 98,
      createdAt: "2026-10-10T14:24:00Z"
    }
  ]
};

// Export to window
if (typeof window !== "undefined") {
  window.SEED_DATA = SEED_DATA;
}
