import { useTranslations } from "next-intl";

const Story = () => {
  const t = useTranslations("AboutPage");

  const paragraphData = [{ index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }];

  return (
    <section className="space-y-4 leading-7 text-neutral-800 dark:text-neutral-300">
      {paragraphData.map((paragraph) => (
        <div key={paragraph.index}>
          {t(`resume.paragraph_${paragraph.index}`)}
        </div>
      ))}
      <div className="pt-2 space-y-1">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Best regards,
        </p>
        <p className="text-2xl font-bold text-yellow-400 dark:text-yellow-400"
           style={{ fontFamily: "'Segoe Script', 'Brush Script MT', cursive" }}>
          Rafli Bima Pratandra
        </p>
      </div>
    </section>
  );
};

export default Story;
