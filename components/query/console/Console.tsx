import * as React from 'react';
import { ConsoleProps } from './hooks';
import { Box } from '@mui/material';
import { DInput, DText } from 'components/common';
import { margin } from 'lib/constants';

export const Console = React.forwardRef(
  (props: ConsoleProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const {
      history = [],
      promptLabel = '>',
      commands = {},
      enabled = true,
    } = props;

    /**
     * Focus on the input whenever we render the Console or click in the Console
     */
    const inputRef = React.useRef<HTMLInputElement>();
    const [input, setInputValue] = React.useState<string>('');

    React.useEffect(() => {
      inputRef.current?.focus();
    });

    const focusInput = React.useCallback(() => {
      inputRef.current?.focus();
    }, []);

    /**
     * When user types something, we update the input value
     */
    const handleInputChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
      },
      []
    );

    /**
     * When user presses enter, we execute the command
     */
    const handleInputKeyDown = React.useCallback(
      async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          if (input.length == 0) {
            commands?.['echo'].fn?.apply(this, ['']);
          }

          const tokens = input.split(/[ ]/);

          if (tokens.length < 1) {
            throwError(
              'Invalid console input. Type --help for docs and how-tos.'
            );
            setInputValue('');
            return;
          }

          let command = tokens[0];

          const commandToExecute = commands?.[command.toLowerCase()];

          if (commandToExecute) {
            let fn = commandToExecute.fn;
            beginCommand(command.toLowerCase());
            let args = tokens.slice(1, tokens.length);
            args = args.length ? args : [];
            try {
                await fn?.apply(this, args);
            } catch (e) {
                throwError('Error executing command ' + e)
            }
          } else
            throwError('Unknown command. Type --help for docs and how-tos.');

          setInputValue('');
        }
      },
      [commands, input]
    );

    const throwError = (err: string) => {
      history.push(<DText text={err} color="error" variant="body2" />);
    };

    const beginCommand = (command: string) => {
      history.push(
        <DText
          text={`Executing command ${command}... `}
          fontWeight="bold"
          variant="body2"
        />
      );
    };

    return (
      <Box
        sx={{
          overflowY: 'scroll',
          maxHeight: '100%',
          backgroundColor: 'transparent',
          color: '#c4c4c4',
          padding: 2,
          lineHeight: 1.42,
          textShadow: 'rgba(0, 0, 0, 0.25)',
        }}
        ref={ref}
        onClick={focusInput}
      >
        <Box sx={{ overflowY: 'scroll' }} flexGrow={0} flexShrink={1} flexBasis='auto'>
          {history.map((line, index) => (
            <Box
              mb={margin}
              sx={{
                overflowY: 'hidden',
                overflowX: 'auto',
              }}
            >
              {line} {'\n'}
            </Box>
          ))}
        </Box>

        <Box display="flex" alignItems="center">
          {enabled && (
            <>
              <Box flexGrow={0} flexShrink={0} flexBasis="auto">
                {promptLabel}
              </Box>
              <Box
                display="flex"
                alignItems="center"
                flex={1}
                ml={margin}
                sx={{ color: '#ffffff' }}
              >
                <DInput
                  InputProps={{
                    sx: {
                      flex: 1,
                      width: '100%',
                      backgroundColor: 'transparent',
                      color: 'primary',
                      border: 0,
                      outline: 'none',
                      lineHeight: 1.42,
                    },
                  }}
                  inputProps={{
                    ref: inputRef,
                    style: {
                      border: 0,
                      outline: 'none',
                      backgroundColor: 'transparent',
                    },
                  }}
                  value={input}
                  onKeyDown={handleInputKeyDown}
                  onChange={handleInputChange}
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
    );
  }
);
