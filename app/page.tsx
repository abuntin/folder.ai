import NewDeal from './component'

export const revalidate = 60;

export default async function SelectDeal() {

  return (
    <section>
      <NewDeal />
    </section>
  );
}
