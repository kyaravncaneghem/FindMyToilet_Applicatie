import { gettext } from 'i18n';

const list_one = [
  {
    name: 'Verversrui',
    value: 'Verversrui',
  },
  {
    name: 'Sint-Jansplein',
    value: 'Sint-Jansplein',
  },
  {
    name: 'Sint-Amanduskerk ',
    value: 'Sint-Amanduskerk',
  },
  {
    name: 'De Coninckplein',
    value: 'De Coninckplein',
  },
  {
    name: 'Handelsbeurs',
    value: 'Handelsbeurs',
  },
];

const list_two = [
  {
    name: 'Verversrui',
    value: 'Verversrui',
  },
  {
    name: 'Sint-Jansplein',
    value: 'Sint-Jansplein',
  },
  {
    name: 'Sint-Amanduskerk ',
    value: 'Sint-Amanduskerk',
  },
  {
    name: 'De Coninckplein',
    value: 'De Coninckplein',
  },
  {
    name: 'Handelsbeurs',
    value: 'Handelsbeurs',
  },
];

registerSettingsPage((/* { settings } */) => (
  <Page>
    <Section title="Settings">
      <Select
        settingsKey="letter"
        label={gettext('myfavoritetoilet')}
        options={list_one}
      />
    </Section>

    <Section title={gettext('toiletsilove')}>
      <AdditiveList
        title="A list with Autocomplete"
        settingsKey="list_one"
        maxItems="5"
        addAction={
          <TextInput
            title={gettext('addlistitem')}
            label={gettext('additem')}
            placeholder={gettext('typesomething')}
            action="Add Item"
            onAutocomplete={(value) =>
              list_one.filter(
                (option) =>
                  option.name.toLowerCase().indexOf(value.toLowerCase()) >= 0,
              )
            }
          />
        }
      />
    </Section>

    <Section title={gettext('toiletsihate')}>
      <AdditiveList
        title="A list with Autocomplete"
        settingsKey="list_two"
        maxItems="5"
        addAction={
          <TextInput
            title={gettext('addlistitem')}
            label={gettext('additem')}
            placeholder={gettext('typesomething')}
            action="Add Item"
            onAutocomplete={(value) =>
              list_two.filter(
                (option) =>
                  option.name.toLowerCase().indexOf(value.toLowerCase()) >= 0,
              )
            }
          />
        }
      />
    </Section>
  </Page>
));
