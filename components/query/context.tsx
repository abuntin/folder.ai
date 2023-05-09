import { useKernel } from 'components/app';
import { DText } from 'components/common';
import { TreeNode } from 'lib/models';
import * as React from 'react';
import { useConsole, ConsoleState, ConsoleCommands } from './console/hooks';
import {
  ConsoleNotificationProps,
  ConsoleNotification,
} from './console/Notification';

interface QueryContextInterface {
  rootDirectory: TreeNode;
  currentDirectory: TreeNode;
  console: ConsoleState & {
    commands: ConsoleCommands;
    pushNotification: (payload: ConsoleNotificationProps) => void;
    pushNotificationDelay: (
      payload: ConsoleNotificationProps,
      delay?: number
    ) => Promise<unknown>;
    pushText: (payload: { text: string }) => void;
    pushTextDelay: (
      payload: { text: string },
      delay?: number
    ) => Promise<unknown>;
  };
}

export const QueryContext = React.createContext<QueryContextInterface>(null);

export const useQuery = () => {
  const context = React.useContext(QueryContext);

  if (!context) throw new Error('Query components only');

  return context;
};

export const QueryProvider = ({ children, ...rest }) => {
  const {
    kernel: { folderTree, rootDirectory },
  } = useKernel();

  const [currentDirectory, setCurrentDirectory] = React.useState<TreeNode>(
    rootDirectory ?? null
  );

  React.useEffect(() => {
    if (currentDirectory == null && rootDirectory != null) {
      setCurrentDirectory(rootDirectory);
      return () => {};
    }
  }, [rootDirectory]);
  const {
    history,
    pushToHistory,
    pushToHistoryWithDelay,
    consoleRef,
    setConsoleRef,
    resetConsole,
  } = useConsole();

  const pushNotification = (payload: ConsoleNotificationProps) =>
    pushToHistory(
      <ConsoleNotification severity={payload.severity} text={payload.text} />
    );

  const pushNotificationDelay = async (
    payload: ConsoleNotificationProps,
    delay = 2000
  ) => {
    await pushToHistoryWithDelay({
      delay,
      content: (
        <ConsoleNotification severity={payload.severity} text={payload.text} />
      ),
    });
  };

  const pushText = async (payload: { text: string }) => {
    pushToHistory(
      <DText
        code={true}
        text={payload.text}
        variant="body2"
        color="primary"
        fontWeight="medium"
      />
    );
  };

  const pushTextDelay = async (payload: { text: string }, delay = 2000) => {
    await pushToHistoryWithDelay({
      delay,
      content: (
        <DText
          code={true}
          text={payload.text}
          variant="body2"
          color="primary"
          fontWeight="medium"
        />
      ),
    });
  };

  const commands = React.useMemo(() => {
    const _c = {
      clear: {
        description: 'Clears Console window',
        fn: resetConsole,
      },
      echo: {
        description: 'Print whatever you type in back to you as plaintext',
        fn: (...args) => {
          pushText({ text: args.join(' ') });
        },
      },
      cd: {
        description:
          "Change Query working directory. You can specify any Directory you'd like",
        fn: (...args) => {
          let directory = args[0] as string;
          let result = folderTree.find({ name: directory });

          if (result) {
            setCurrentDirectory(result);
            pushNotification({
              severity: 'info',
              text: `Changed working Directory. Now in ${result.folder.name}`,
            });
          } else
            pushNotification({ severity: 'error', text: 'Unknown Directory' });
        },
      },
      help: {
        description: 'How-tos and CommandList',
        fn: () => {
          pushText({
            text:
              'Need some help? This guide contains Query commands and how-tos, for more help visit the Support page \n\n' +
              Object.keys(commands)
                .map(
                  command =>
                    `- Command ${command}: ${commands[command].description}`
                )
                .join('\n'),
          });
        },
      },
    };
    return _c;
  }, [pushToHistory]);

  return (
    <QueryContext.Provider
      value={{
        console: {
          history,
          pushToHistory,
          pushToHistoryWithDelay,
          consoleRef,
          setConsoleRef,
          resetConsole,
          pushNotification,
          pushNotificationDelay,
          pushText,
          pushTextDelay,
          commands,
        },
        rootDirectory,
        currentDirectory,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};
