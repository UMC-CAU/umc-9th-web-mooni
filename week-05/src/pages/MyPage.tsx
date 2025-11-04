import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth.ts";
import { ResponseMyInfoDto } from "../types/auth.ts";

const MyPage = () => {
  const [data, setData] = useState<ResponseMyInfoDto>([]);

  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);

      setData(response);
    };

    getData();
  }, []);

  return (
    <div>
      {data.data.name} {data.data.email}
    </div>
  );
};

export default MyPage;
