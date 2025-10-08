import React, { useState, useEffect } from "react";

// Simple single-file React component for a household (가계부) app
// - Uses localStorage for persistence
// - Tailwind classes for styling
// - Minimal features: add income/expense, categories, monthly summary, CSV export/import
// - Default export component so this can be previewed directly

export default function HouseholdLedgerApp() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const raw = localStorage.getItem("ledger_transactions_v1");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [form, setForm] = useState({ type: "expense", amount: "", category: "기타", memo: "", date: new Date().toISOString().slice(0, 10) });
  const [queryMonth, setQueryMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const categories = ["식비", "교통", "주거/관리비", "공과금", "용돈/생활비", "쇼핑", "의료/보험", "기타"];

  useEffect(() => {
    localStorage.setItem("ledger_transactions_v1", JSON.stringify(transactions));
  }, [transactions]);

  function addTransaction(e) {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (!amt || isNaN(amt)) return alert("금액을 숫자로 입력하세요.");

    const txn = {
      id: Date.now().toString(),
      type: form.type,
      amount: Math.abs(amt),
      category: form.category,
      memo: form.memo,
      date: form.date,
    };
    setTransactions(prev => [txn, ...prev]);
    setForm({ ...form, amount: "", memo: "" });
  }

  function removeTxn(id) {
    if (!confirm("삭제하시겠습니까?")) return;
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  function downloadCSV() {
    const header = ["id","type","amount","category","memo","date"];
    const rows = transactions.map(t => [t.id, t.type, t.amount, t.category, '"' + (t.memo||"").replace(/"/g, '""') + '"', t.date]);
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ledger_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importCSV(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) return alert('유효한 CSV가 아닙니다.');
      const [header, ...rows] = lines;
      const parsed = rows.map(r => {
        // crude CSV parse, assumes no commas in fields except memo quoted above
        const cols = r.split(',');
        return {
          id: cols[0],
          type: cols[1],
          amount: parseFloat(cols[2]) || 0,
          category: cols[3],
          memo: cols[4] ? cols[4].replace(/^"|"$/g, '').replace(/""/g, '"') : '',
          date: cols[5] || new Date().toISOString().slice(0,10)
        };
      });
      setTransactions(prev => [...parsed, ...prev]);
    };
    reader.readAsText(file, 'utf-8');
  }

  const filtered = transactions.filter(t => t.date.slice(0,7) === queryMonth);
  const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const byCategory = {};
  filtered.forEach(t => {
    byCategory[t.category] = (byCategory[t.category] || 0) + (t.type === 'expense' ? t.amount : -t.amount);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">간단한 가계부 앱 (MVP)</h1>
          <p className="text-sm text-gray-600">로컬 저장(localStorage) 기반 / CSV 가져오기·내보내기 지원</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <form onSubmit={addTransaction} className="col-span-1 md:col-span-2 bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex gap-2 mb-2">
              <label className="flex-1">
                <div className="text-xs text-gray-500">종류</div>
                <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} className="w-full p-2 border rounded">
                  <option value="expense">지출</option>
                  <option value="income">수입</option>
                </select>
              </label>
              <label className="flex-1">
                <div className="text-xs text-gray-500">금액</div>
                <input value={form.amount} onChange={e => setForm(f => ({...f, amount: e.target.value}))} placeholder="0" className="w-full p-2 border rounded" />
              </label>
              <label className="flex-1">
                <div className="text-xs text-gray-500">날짜</div>
                <input type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} className="w-full p-2 border rounded" />
              </label>
            </div>

            <div className="flex gap-2 mb-2">
              <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="flex-1 p-2 border rounded">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="기타">기타</option>
              </select>
              <input value={form.memo} onChange={e => setForm(f => ({...f, memo: e.target.value}))} placeholder="메모 (선택)" className="flex-1 p-2 border rounded" />
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-2xl">추가</button>
              <button type="button" onClick={() => { setTransactions([]); localStorage.removeItem('ledger_transactions_v1'); }} className="px-4 py-2 bg-red-100 text-red-700 rounded-2xl">초기화</button>
              <div className="ml-auto flex items-center gap-2">
                <button type="button" onClick={downloadCSV} className="px-3 py-1 border rounded">CSV 내보내기</button>
                <label className="px-3 py-1 border rounded cursor-pointer">
                  CSV 가져오기
                  <input type="file" accept=".csv" className="hidden" onChange={e => e.target.files && importCSV(e.target.files[0])} />
                </label>
              </div>
            </div>
          </form>

          <aside className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="mb-3">
              <div className="text-sm text-gray-500">조회 월</div>
              <input type="month" value={queryMonth} onChange={e => setQueryMonth(e.target.value)} className="w-full p-2 border rounded" />
            </div>

            <div className="mb-2">
              <div className="text-xs text-gray-500">수입</div>
              <div className="text-xl font-semibold">{income.toLocaleString()}원</div>
            </div>
            <div className="mb-2">
              <div className="text-xs text-gray-500">지출</div>
              <div className="text-xl font-semibold text-red-600">{expense.toLocaleString()}원</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">잔액</div>
              <div className={`text-xl font-semibold ${income - expense < 0 ? 'text-red-600' : 'text-green-600'}`}>{(income - expense).toLocaleString()}원</div>
            </div>
          </aside>
        </section>

        <section className="mt-6 bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-3">내역 ({queryMonth})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="p-2">날짜</th>
                  <th className="p-2">종류</th>
                  <th className="p-2">카테고리</th>
                  <th className="p-2">메모</th>
                  <th className="p-2">금액</th>
                  <th className="p-2">액션</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="border-t">
                    <td className="p-2">{t.date}</td>
                    <td className="p-2">{t.type === 'income' ? '수입' : '지출'}</td>
                    <td className="p-2">{t.category}</td>
                    <td className="p-2">{t.memo}</td>
                    <td className="p-2">{t.amount.toLocaleString()}원</td>
                    <td className="p-2"><button onClick={() => removeTxn(t.id)} className="text-sm text-red-600">삭제</button></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="p-4 text-center text-gray-400">조회된 내역이 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <h3 className="font-medium">카테고리별 요약</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {Object.keys(byCategory).length === 0 && <div className="text-gray-400 p-2">데이터가 없습니다.</div>}
              {Object.entries(byCategory).map(([cat, val]) => (
                <div key={cat} className="bg-gray-50 p-2 rounded">
                  <div className="text-sm text-gray-500">{cat}</div>
                  <div className={`font-semibold ${val > 0 ? 'text-red-600' : 'text-green-600'}`}>{Math.abs(val).toLocaleString()}원 {val>0? '지출':'(순수입)'}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-gray-400 mt-6">간단한 데모용입니다. 원하시면 로그인, 다중기기 동기화(서버), 고급 통계, 예산 알림 등을 추가해 드릴게요.</footer>
      </div>
    </div>
  );
}
