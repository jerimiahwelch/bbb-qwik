import { component$, useResource$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  const location = useLocation();
  debugger;
  console.log(location.params.id);
  return (
    <>
      <div id="searchPage">Search Page is awesome</div>
      <Clock />
    </>
  );
});

export const Clock = component$(() => {
  return <div>Clock</div>;
});

