import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import axios from "axios";
import { POSTS, USERS } from "./type";

let buddhistEra = require("dayjs/plugin/buddhistEra");
dayjs.extend(buddhistEra);

function App() {
  //---------------
  // STATE
  //---------------
  const [users, setUsers] = useState<Array<USERS>>([]);
  const [posts, setPosts] = useState<Array<POSTS>>([]);

  //---------------
  // EFFECT
  //---------------
  useEffect(() => {
    getUsers();
    getPosts();
  }, []);

  //---------------
  // HANDLE
  //---------------
  const getUsers = async () => {
    try {
      const resp = await axios("https://maqe.github.io/json/authors.json");
      if (resp.status === 200) {
        setUsers(resp.data);
      }
    } catch (err: any) {
      Swal.fire({
        title: "Error Fetching Data",
        text: err.message,
      });
    }
  };

  const getPosts = async () => {
    try {
      const resp = await axios("https://maqe.github.io/json/posts.json");
      if (resp.status === 200) {
        setPosts(resp.data);
      }
    } catch (err: any) {
      Swal.fire({
        title: "Error Fetching Data",
        text: err.message,
      });
    }
  };

  const handleAuthor = (authorId: number) => {
    let result = { img: "", name: "" };
    let findAuthor = users.find((id) => id.id === authorId);
    result.img = findAuthor?.avatar_url || "";
    result.name = findAuthor?.name || "";
    return result;
  };

  const handleColorBox = (index: number) => {
    return index % 2 === 1 ? true : false;
  };
  //---------------
  // RENDER
  //---------------
  return (
    <div className="bg-gray-200">
      <div className="min-h-screen mx-auto p-6 desktop:pt-6 desktop:w-[1440px]">
        <div className="w-full h-full ">
          <p className="text-2xl font-bold">MAQE Forum</p>
          <p className="mt-6 text-2xl">
            Your current timezone is: Asia/Bangkok
          </p>
          <div className="mt-4 max-h-[41rem] overflow-y-scroll">
            {posts.length > 0 &&
              posts.map((item, index) => (
                <div
                  key={`${item.title}_${index}`}
                  className="shadow-md w-full min-h-[260px] mb-4"
                  style={{
                    background: handleColorBox(index) ? "#D9F5FF" : "white",
                  }}
                >
                  <div className="items-center px-4 py-3 border-b tablet:space-x-2 tablet:flex">
                    <div className="flex items-center">
                      <img
                        src={handleAuthor(item.author_id).img}
                        className="w-6 rounded-full"
                      />
                      <p className="ml-2 font-medium text-orange-600">
                        {handleAuthor(item.author_id).name}
                      </p>
                    </div>
                    <p className="font-medium text-gray-400">{`posted on ${dayjs(
                      item.created_at
                    ).format("dddd, MMMM D, YYYY, HH:mm")}`}</p>
                  </div>
                  <div className="p-4 tablet:flex">
                    <img
                      src={item.image_url || ""}
                      className="h-[220px] w-full tablet:h-full tablet:w-[280px] flex-shrink-0"
                    />
                    <div className="tablet:ml-4">
                      <p className="font-semibold text-[20px]">
                        {item.title || "-"}
                      </p>
                      <p className="font-light">{item.body || "-"}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
