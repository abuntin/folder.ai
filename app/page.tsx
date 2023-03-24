import NewDeal from './component'
import { DashboardListItem } from 'components'
import { sampleIOU } from 'lib/models';

export const revalidate = 60;

export default async function SelectDeal() {

  return (
    <section className="mx-6 my-6">
      <NewDeal />
    </section>
  );
}
