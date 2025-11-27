import { Category, Task, UserProfile } from "../types";
import { CategoryIcon } from "./CategoryIcon";

interface CategoryTabProps {
  tasks: Task[];
  categories: Category[];
  setSelectedCategoryId: (string) => void;
  setCurrentView: (string) => void;
  userProfile: UserProfile;
  navigateToCategory: (string) => void;
}

function CategoryCard({
  category,
  navigateToCategory,
}: {
  category: Category;
  navigateToCategory: () => void;
}) {
  return (
    <div
      className={`flex flex-col justify-center rounded-xl items-center py-4 shadow-sm`}
      style={{
        backgroundColor: `${category.color}10`,
        border: `2px solid ${category.color}60`,
      }}
      onClick={navigateToCategory}
    >
      <div className="flex w-full px-4 gap-2 items-center">
        <CategoryIcon
          iconName={category.icon}
          size={20}
          color={category.color}
          className=""
        />
        <div>
          <div className="mb-[-1px] flex-grow">{category.name}</div>
          <div className="text-gray-500 text-xs">
            {category.taskCount} tasks
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryTab({
  tasks,
  categories,
  setSelectedCategoryId,
  setCurrentView,
  userProfile,
  navigateToCategory,
}: CategoryTabProps) {
  const completed = {
    name: "Completed",
    color: "#22c55e",
    icon: "CheckCircle",
    id: "completed",
    isCustom: false,
    taskCount: tasks.filter((t) => t.completed).length,
  };
  return (
    <div className="space-y-4">
      <h1 className="text-[#312E81] text-2xl font-bold">Categories</h1>
      <div className="grid grid-cols-2 gap-4 auto-rows-fr">
        {/* Completed Tasks Category */}

        <CategoryCard
          category={completed}
          navigateToCategory={() => {
            setSelectedCategoryId("completed");
            setCurrentView("category");
          }}
        />

        {categories
          .filter(
            (category) => !userProfile.hiddenCategories.includes(category.name)
          )
          .map((category) => {
            const categoryTaskCount = tasks.filter(
              (t) => t.categoryId === category.id && !t.completed
            ).length;
            category.taskCount = categoryTaskCount;
            return (
              <CategoryCard
                category={category}
                key={category.id}
                navigateToCategory={() => navigateToCategory(category.id)}
              />
            );
          })}
      </div>
    </div>
  );
}
