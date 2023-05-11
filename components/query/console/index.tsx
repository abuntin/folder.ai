import { DText } from 'components/common';
import React from 'react';
import { useQuery } from '../context';
import { Console } from './Console';

interface ConsoleViewProps {}

export const ConsoleView: React.FC<ConsoleViewProps> = props => {
  const {
    console: {
      history,
      pushTextDelay,
      pushText,
      setConsoleRef,
      resetConsole,
      pushNotification,
      pushNotificationDelay,
      commands,
    },
    loading,
    query
  } = useQuery();

  React.useEffect(() => {
    if (query.currentDirectory && !loading.console) {
      pushNotification({
        severity: 'success',
        text: 'Initialised successfully.',
      });

      pushTextDelay(
        {
          text: "Welcome to Query by FolderAI! This is your Console, where you'll see whats happening in the background. You can also send commands to Query when its idle; type in the command 'help' and press 'Enter' to send) for guides and how-tos.",
        },
        500
      );

      return () => {}
    }
  }, [query.currentDirectory, loading.console]);

  React.useEffect(() => {
    resetConsole();
    pushNotification({ severity: 'info', text: 'Initialising Query...' });
  }, []);

  return (
    <Console
      commands={commands}
      history={history}
      ref={setConsoleRef}
      disabled={loading.console}
      promptLabel={
        <DText code text={`${query.currentDirectory?.folder?.name ?? ''} > `} />
      }
    />
  );
};
