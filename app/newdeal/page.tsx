import NewDeal from './component'

export const revalidate = 60;

async function delayRender() {
  setTimeout(() => {}, 3000)

  return []
}


export default async function SelectDeal() {

  // const data = await delayRender()
  
  return (
    <section className="mx-6 my-6">
      <NewDeal />
    </section>
  );
}
