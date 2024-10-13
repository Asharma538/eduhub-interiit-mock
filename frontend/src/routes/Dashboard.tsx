import { createSignal, createEffect } from "solid-js";
import ClassCard from "../components/Dashboard/ClassCard";
import { ClassCardProps } from "../components/Dashboard/ClassCard";
import { classCardsData } from "../data/ClassCardData";

import { useAxiosContext } from "../lib/useAxiosContext";

const Dashboard = () => {
  const [loading, setLoading] = createSignal(true);
  const [classes, setClasses] = createSignal<ClassCardProps[]>([]);

  // Simulate loading and data fetch (replace with actual API call)
  createEffect(() => {
    setTimeout(() => {
      setClasses(classCardsData);
      setLoading(false);
    }, 2000);
  });

  return (
    <div class="overflow-x-hidden">
      {loading() ? (
        <div>Loading classes...</div>
      ) : classes().length === 0 ? (
        <div class="flex h-screen w-screen items-center justify-center text-xl">
          No classes found! Join or create one!
        </div>
      ) : (
        <div class="flex flex-wrap w-screen p-7">
          {classes().map((individualClass) => (
            <ClassCard
              creatorName={individualClass.creatorName}
              creatorPhoto={individualClass.creatorPhoto}
              name={individualClass.name}
              id={individualClass.id}
              style={{ "margin-right": "30px", "margin-bottom": "30px" }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
