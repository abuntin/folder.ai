import NewDeal from './component'

export const revalidate = 60;

export default async function SelectDeal() {

  return (
    <section className='px-6'>
      <NewDeal />
    </section>
  );
}
