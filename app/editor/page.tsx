import { EditorView } from "components";

export const revalidate = 60;

async function delayRender() {
  setTimeout(() => {}, 3000)

  return []
}


export default async function Editor() {

  // const data = await delayRender()
  
  return (
    <section className="mx-6 my-6">
      <EditorView />
    </section>
  );
}
