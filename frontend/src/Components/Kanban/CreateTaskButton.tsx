// src/components/CreateTaskButton.tsx
interface CreateTaskButtonProps {
  onClick: () => void;
}

const CreateTaskButton = ({ onClick }: CreateTaskButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow-md"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Создать задачу
    </button>
  );
};

export default CreateTaskButton;