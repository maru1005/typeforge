// app/components/word-list.tsx

type WordListProps = {
  words: string[];
};

export default function WordList({ words }: WordListProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {words.map((word, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-slate-200 px-6 py-4 text-center font-bold text-slate-700"
        >
          {word}
        </div>
      ))}
    </div>
  );
}
