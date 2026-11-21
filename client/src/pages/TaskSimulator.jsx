import React, { useState } from 'react';

export default function TaskSimulator({ challengeId = 'chl_two_sum', onFinish }) {
  const [code, setCode] = useState(`function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      setOutput({
        passed: 5,
        total: 5,
        durationMs: 1.2,
        astUniqueness: 98,
        results: [
          { name: 'Standard positive array', passed: true, time: '1.2ms' },
          { name: 'Duplicate elements check', passed: true, time: '0.9ms' },
          { name: 'Large array benchmark', passed: true, time: '3.4ms' }
        ]
      });
      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-terminalDark text-slate-100 font-mono">
      {/* Editor & Controls */}
      <div className="flex-1 flex flex-col border-r border-slate-700">
        <div className="h-12 bg-terminalBg px-4 flex items-center justify-between border-b border-slate-700 text-xs">
          <span className="font-bold text-slate-200">Task Simulator IDE :: solution.js</span>
          <div className="flex items-center gap-2">
            <button
              onClick={runTests}
              disabled={isRunning}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-bold border border-slate-600"
            >
              {isRunning ? 'Running...' : 'Run Tests'}
            </button>
            <button
              onClick={onFinish}
              className="px-3 py-1.5 bg-brand hover:bg-blue-600 text-white rounded-lg text-xs font-bold"
            >
              Submit & Verify
            </button>
          </div>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 p-4 bg-terminalDark text-emerald-300 font-mono text-xs resize-none focus:outline-none"
        />
      </div>

      {/* Terminal Output */}
      <div className="w-full md:w-96 bg-terminalBg flex flex-col text-xs">
        <div className="h-12 bg-[#162032] px-4 flex items-center border-b border-slate-700 font-bold text-slate-300">
          Sandbox Telemetry Output
        </div>
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {output ? (
            <div className="space-y-2">
              <p className="text-emerald-400 font-bold">&gt; {output.passed}/{output.total} Tests Passed ({output.durationMs}ms)</p>
              <p className="text-blue-300">&gt; AST Token Uniqueness: {output.astUniqueness}%</p>
              <div className="pt-2 border-t border-slate-700 space-y-1.5">
                {output.results.map((r, i) => (
                  <div key={i} className="flex justify-between text-slate-300">
                    <span>✓ {r.name}</span>
                    <span className="text-slate-500">{r.time}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-500 italic">&gt; Click "Run Tests" to execute against visible, edge, and performance unit suites.</p>
          )}
        </div>
      </div>
    </div>
  );
}
