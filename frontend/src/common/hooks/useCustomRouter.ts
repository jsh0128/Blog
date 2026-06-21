import { NextRouter, useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

const useCustomRouter = <T = { [key: string]: string }>(): NextRouter & {
  query: ParsedUrlQuery & T;
} => {
  const router = useRouter();

  const typedQuery = router.query as ParsedUrlQuery & T;

  return { ...router, query: typedQuery };
};

export default useCustomRouter;
