import { TreeRoot } from 'components/common';
import { Container } from 'components/dashboard/container'
import dynamic from 'next/dynamic';


export const revalidate = 60;


async function delayRender() {
  setTimeout(() => {}, 3000)

  return []
}

export default async function Dashboard() {

  // const data = await delayRender()

  return (
    <section className="mx-6 my-6">
      <Container />
    </section>
  );
}
