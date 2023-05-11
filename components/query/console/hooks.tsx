import { useCallback, useEffect, useState, ReactNode } from 'react';

export type ConsoleHistoryItem = ReactNode | string;
export type ConsoleHistory = ConsoleHistoryItem[];
export type ConsolePushToHistoryWithDelayProps = {
  content: ConsoleHistoryItem;
  delay?: number;
};

export type ConsoleCommands = {
  [command: string]: {
    description: string;
    fn: (...args) => void
  };
};

export type ConsoleProps = {
  history: ConsoleHistory;
  promptLabel?: ConsoleHistoryItem;
  commands: ConsoleCommands;
  disabled?: boolean
};

export interface ConsoleState {
    history: ConsoleHistory,
    pushToHistory: (item: ConsoleHistoryItem) => void,
    pushToHistoryWithDelay: (payload: ConsolePushToHistoryWithDelayProps) => Promise<unknown>,
    consoleRef: HTMLDivElement,
    setConsoleRef: (node: HTMLDivElement) => void,
    resetConsole: () => void,
}

export const useConsole = (): ConsoleState => {
  const [consoleRef, setDomNode] = useState<HTMLDivElement>();
  const setConsoleRef = useCallback(
    (node: HTMLDivElement) => setDomNode(node),
    []
  );

  const [history, setHistory] = useState<ConsoleHistory>([]);

  /**
   * Scroll to the bottom of the console when window is resized
   */
  useEffect(() => {
    const windowResizeEvent = () => {
      consoleRef?.scrollTo({
        top: consoleRef?.scrollHeight ?? 99999,
        behavior: 'smooth',
      });
    };
    window.addEventListener('resize', windowResizeEvent);

    return () => {
      window.removeEventListener('resize', windowResizeEvent);
    };
  }, [consoleRef]);

  /**
   * Scroll to the bottom of the console on every new history item
   */
  useEffect(() => {
    consoleRef?.scrollTo({
      top: consoleRef?.scrollHeight ?? 99999,
      behavior: 'smooth',
    });
  }, [history, consoleRef]);

  const pushToHistory = useCallback((item: ConsoleHistoryItem) => {
    setHistory(old => [...old, item]);
  }, []);

  /**
   * Write text to console
   * @param content The text to be printed in the console
   * @param delay The delay in ms before the text is printed
   * @param executeBefore The function to be executed before the text is printed
   * @param executeAfter The function to be executed after the text is printed
   */
  const pushToHistoryWithDelay = useCallback(
    ({ delay = 0, content }: ConsolePushToHistoryWithDelayProps) =>
      new Promise(resolve => {
        setTimeout(() => {
          pushToHistory(content);
          return resolve(content);
        }, delay);
      }),
    [pushToHistory]
  );

  /**
   * Reset the console window
   */
  const resetConsole = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    pushToHistory,
    pushToHistoryWithDelay,
    consoleRef,
    setConsoleRef,
    resetConsole,
  };
};
