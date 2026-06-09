// app/components/word-list.tsx

type WordListProps = {
  words: string[];
};

export default function WordList({ words }: WordListProps) {
  return (
    <div>
      {words[0] && (
        <p className="text-4xl font-bold font-mono text-center text-slate-800">
          {words[0]}
        </p>
      )}
    </div>
  );
}
