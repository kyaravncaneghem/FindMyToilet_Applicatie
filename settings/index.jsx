import { gettext } from 'i18n';

registerSettingsPage((/* { settings } */) => (
  <Page>
    <Section title="Settings">
      <Text>{gettext('hello_world')}</Text>
    </Section>
  </Page>
));
