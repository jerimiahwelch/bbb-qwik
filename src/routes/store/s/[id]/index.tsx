import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  const loc = useLocation();
  return (
    <>
      <div id="searchPage">Search Page is awesome </div>
      <pre>{JSON.stringify(loc, null, 2)}</pre>
      <Clock />
    </>
  );
});

export const Clock = component$(() => {
  return <div>Clock</div>;
});

