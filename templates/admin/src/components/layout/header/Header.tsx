import { MenuItem } from '@mui/material';
import classNames from 'classnames';
import { getGlobalInstance } from 'plume-ts-di';
import React from 'react';
import { useObservable } from 'micro-observables';
import LocaleService from '@i18n/locale/LocaleService';
import SessionService from '@services/session/SessionService';
import DropdownMenu from '@components/theme/DropdownMenu';
import LocaleSelector from '@components/theme/LocaleSelector';
import useMessages from '@i18n/hooks/messagesHook';
import { UserWithExpiration } from '@services/session/User';
import { Locale } from '@lib/locale-resolver/LocaleResolver';
import scss from './header.module.scss';

function makeInitials(fullName?: string): string {
  if (!fullName) {
    return '';
  }
  const names: string[] = fullName.split(' ');
  let initials: string = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
}

function LocaleSelectorContainer() {
  const localeService: LocaleService = getGlobalInstance(LocaleService);
  const currentLocale: Locale | undefined = useObservable(localeService.getCurrentLocale());

  return <LocaleSelector
    currentLocale={currentLocale}
    availableLocales={localeService.getAvailableLocales()}
    onLocaleSelected={(newLocale: Locale) => localeService.setCurrentLocale(newLocale)}
  />;
}

export default function Header() {
  const sessionService: SessionService = getGlobalInstance(SessionService);
  const currentUser: UserWithExpiration | undefined = useObservable(sessionService.getCurrentUser());
  const { messages } = useMessages();

  return (
    <header id={scss.mainHeader}>
      <h1>{messages.app.name}</h1>
      <div className={scss.header_actions}>
        <div className={scss.header_action}>
          <LocaleSelectorContainer />
        </div>
        {
          currentUser
          && (
            <div className={classNames(scss.header_action, scss['header_action--circle'])}>
              <DropdownMenu label={makeInitials(currentUser.fullName)} id="user-menu">
                <div id={scss.userName}>{currentUser.fullName}</div>
                <MenuItem
                  onClick={() => sessionService.disconnect()}
                >
                  {messages.action.disconnect}
                </MenuItem>
              </DropdownMenu>
            </div>
          )
        }
      </div>
    </header>
  );
}
