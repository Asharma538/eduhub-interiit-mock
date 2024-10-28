import { createSignal, createEffect } from "solid-js";
import ClassCard from "../components/Dashboard/ClassCard";
import { ClassCardProps } from "../components/Dashboard/ClassCard";
import { classCardsData } from "../data/ClassCardData";

import { useAxiosContext } from "../lib/useAxiosContext";

interface GetClasses {
  id: string;
  name: string;
  details: string;
  teacher: string;
  isTeacher: boolean
}

const Dashboard = () => {
  const [loading, setLoading] = createSignal(true);
  const [classes, setClasses] = createSignal<GetClasses[]>([]);
  const axios = useAxiosContext();
  // Simulate loading and data fetch (replace with actual API call)
  createEffect(() => {
    axios!.get("/classes").then((response) => {
      console.log(response.data);

      setClasses(response.data.data);
      setLoading(false);
    });
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
              details={individualClass.details}
              creatorName={individualClass.teacher}
              name={individualClass.name}
              id={individualClass.id}
              style={{ "margin-right": "30px", "margin-bottom": "30px" }}
              isTeacher= {individualClass.isTeacher}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
