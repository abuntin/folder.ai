import { useKernel } from 'components/app';
import { DText } from 'components/common';
import { Query, TreeNode } from 'lib/models';
import * as React from 'react';
import { useConsole, ConsoleState, ConsoleCommands } from './console/hooks';
import {
  ConsoleNotificationProps,
  ConsoleNotification,
} from './console/Notification';

type LoadingType = 'query' | 'console'

interface QueryContextInterface {
  loading: { [k in LoadingType]: boolean };
  query: Query;
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
  const { kernel } = useKernel();

  const { current: query } = React.useRef(new Query(kernel));

  const [isPending, startTransition] = React.useTransition()

  const [loading, setLoadingState] = React.useState<
    QueryContextInterface['loading']
  >({
    query: true,
    console: true,
  });

  const setLoading = (state: boolean, type: LoadingType | 'all') =>
    startTransition(() => {
      if (type == 'all') setLoadingState({ query: state, console: state })
      else setLoadingState({ ...loading, [type]: state })
  });

  React.useEffect(() => {
    if (kernel.rootDirectory) {
      query.updateKernel(kernel);
      try {
        query.init();
      } catch (e) {
        console.error(e);
      }
    }
  }, [kernel.rootDirectory]);

  // Listen for loading event

  React.useEffect(() => {
    const loadingEvent = query.on('loading', (type: LoadingType) =>
      setLoading(true, type)
    );

    return () => {
      loadingEvent.unsubscribe();
    };
  }, [query]);

   // Listen for idle (success) event

   React.useEffect(() => {
    const idleEvent = query.on('idle', success =>
      setLoading(false, 'all')
    );

    return () => {
      idleEvent.unsubscribe();
    };
  }, [query]);

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
          let result = query.changeDirectory({ name: directory });

          if (result) {
            pushNotification({
              severity: 'info',
              text: `Changed working Directory. Now in ${query.currentDirectory.folder.name}`,
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
        loading,
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
        query,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};
