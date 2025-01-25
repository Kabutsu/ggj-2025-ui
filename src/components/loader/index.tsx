export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-16 h-16 border-4 border-gray-300 rounded-full border-r-transparent animate-spin" />
    </div>
  );
};
