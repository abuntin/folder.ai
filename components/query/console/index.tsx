import React from 'react';
import { Console } from './Console';
import { useQuery } from '../context';
import { DText } from 'components/common';

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
    currentDirectory,
  } = useQuery();

  React.useEffect(() => {
    if (currentDirectory) {
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
  }, [currentDirectory]);

  React.useEffect(() => {
    resetConsole();
    pushNotification({ severity: 'info', text: 'Initialising Query...' });

  }, []);

  return (
    <Console
      commands={commands}
      history={history}
      ref={setConsoleRef}
      enabled={currentDirectory != null}
      promptLabel={
        <DText code text={`${currentDirectory?.folder?.name ?? ''} > `} />
      }
    />
  );
};
