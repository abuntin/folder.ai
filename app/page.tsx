import { Container } from 'components/query'


export const revalidate = 60;


async function delayRender() {
  setTimeout(() => {}, 3000)

  return []
}

export default async function Dashboard() {

  // const data = await delayRender()

  return (
    <section className="mx-0 my-3">
      <Container />
    </section>
  );
}
