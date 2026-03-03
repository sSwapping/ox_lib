import { Button, Group, Modal, Stack, createStyles } from '@mantine/core';
import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { useLocales } from '../../providers/LocaleProvider';
import { fetchNui } from '../../utils/fetchNui';
import type { InputProps } from '../../typings';
import { OptionValue } from '../../typings';
import InputField from './components/fields/input';
import CheckboxField from './components/fields/checkbox';
import SelectField from './components/fields/select';
import NumberField from './components/fields/number';
import SliderField from './components/fields/slider';
import { useFieldArray, useForm } from 'react-hook-form';
import ColorField from './components/fields/color';
import DateField from './components/fields/date';
import TextareaField from './components/fields/textarea';
import TimeField from './components/fields/time';
import dayjs from 'dayjs';

export type FormValues = {
  test: {
    value: any;
  }[];
};

const useStyles = createStyles((theme) => ({
  modal: {
    backgroundColor: '#141414',
    borderRadius: 8,
    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
    fontFamily: 'Roboto, sans-serif',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  header: {
    backgroundColor: 'transparent',
    padding: '16px 20px 8px 20px',
    justifyContent: 'center',
  },
  title: {
    color: '#fff3fc',
    fontSize: 22,
    fontWeight: 800,
    lineHeight: 1.2,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Roboto, sans-serif',
    letterSpacing: '-0.02em',
    width: '100%',
  },
  body: {
    padding: '12px',
    '&::-webkit-scrollbar': {
      width: 4,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 4,
    },

    '&::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      borderRadius: 4,
      top: -2,
      left: -2,
      right: -2,
      bottom: -2,
      zIndex: 100,
      pointerEvents: 'none',
      backgroundImage: `
        linear-gradient(to right, #ffa3e9 2px, transparent 2px),
        linear-gradient(to bottom, #ffa3e9 2px, transparent 2px),
        linear-gradient(to left, #ffa3e9 2px, transparent 2px),
        linear-gradient(to bottom, #ffa3e9 2px, transparent 2px),
        linear-gradient(to left, #ffa3e9 2px, transparent 2px),
        linear-gradient(to top, #ffa3e9 2px, transparent 2px),
        linear-gradient(to right, #ffa3e9 2px, transparent 2px),
        linear-gradient(to top, #ffa3e9 2px, transparent 2px)
      `,
      backgroundPosition: `
        0 0, 0 0,
        100% 0, 100% 0,
        100% 100%, 100% 100%,
        0 100%, 0 100%
      `,
      backgroundSize: '12px 12px',
      backgroundRepeat: 'no-repeat',
    },
  },
  button: {
    height: 44,
    minWidth: 100,
    padding: '0 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: 6,
    color: '#fff3fc',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: 15,
    fontWeight: 500,
    fontFamily: 'Roboto, sans-serif',
    textTransform: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      borderColor: 'rgba(255, 163, 233, 0.3)',
      color: '#ffa3e9',
      transform: 'translateY(-1px)',
    },

    '&:active': {
      transform: 'translateY(1px)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      boxShadow: 'none',
    },

    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      transform: 'none',
      boxShadow: 'none',
      color: theme.colors.gray[6],
    },

    '&:focus-visible': {
      outline: '2px solid #ffa3e9',
      outlineOffset: 2,
    },
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    color: theme.colors.gray[4],
    borderColor: 'transparent',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      color: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      transform: 'translateY(-1px)',
    },

    '&:active': {
      transform: 'translateY(1px)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  },
}));

const InputDialog: React.FC = () => {
  const { classes, cx } = useStyles();
  const [fields, setFields] = React.useState<InputProps>({
    heading: '',
    rows: [{ type: 'input', label: '' }],
  });
  const [visible, setVisible] = React.useState(false);
  const { locale } = useLocales();

  const form = useForm<{ test: { value: any }[] }>({});
  const fieldForm = useFieldArray({
    control: form.control,
    name: 'test',
  });

  useNuiEvent<InputProps>('openDialog', (data) => {
    setFields(data);
    setVisible(true);
    data.rows.forEach((row, index) => {
      fieldForm.insert(index, {
        value:
          row.type !== 'checkbox'
            ? row.type === 'date' || row.type === 'date-range' || row.type === 'time'
              ? // Set date to current one if default is set to true
                row.default === true
                ? new Date().getTime()
                : Array.isArray(row.default)
                ? row.default.map((date) => new Date(date).getTime())
                : row.default && new Date(row.default).getTime()
              : row.default
            : row.checked,
      });
      if (row.type === 'select' || row.type === 'multi-select') {
        row.options = row.options.map((option) =>
          !option.label ? { ...option, label: option.value } : option
        ) as Array<OptionValue>;
      }
    });
  });

  useNuiEvent('closeInputDialog', async () => await handleClose(true));

  const handleClose = async (dontPost?: boolean) => {
    setVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    if (dontPost) return;
    fetchNui('inputData');
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setVisible(false);
    const values: any[] = [];
    for (let i = 0; i < fields.rows.length; i++) {
      const row = fields.rows[i];

      if ((row.type === 'date' || row.type === 'date-range') && row.returnString) {
        if (!data.test[i]) continue;
        data.test[i].value = dayjs(data.test[i].value).format(row.format || 'DD/MM/YYYY');
      }
    }
    Object.values(data.test).forEach((obj: { value: any }) => values.push(obj.value));
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    fetchNui('inputData', values);
  });

  return (
    <>
      <Modal
        opened={visible}
        onClose={handleClose}
        centered
        closeOnEscape={fields.options?.allowCancel !== false}
        closeOnClickOutside={false}
        size={fields.options?.size || 'sm'}
        classNames={{
          modal: classes.modal,
          header: classes.header,
          title: classes.title,
          body: classes.body,
        }}
        title={fields.heading}
        withCloseButton={false}
        overlayOpacity={0.5}
        transition="fade"
        exitTransitionDuration={150}
      >
        <form onSubmit={onSubmit}>
          <Stack spacing="xs">
            {fieldForm.fields.map((item, index) => {
              const row = fields.rows[index];
              return (
                <React.Fragment key={item.id}>
                  {row.type === 'input' && (
                    <InputField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                  {row.type === 'checkbox' && (
                    <CheckboxField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                  {(row.type === 'select' || row.type === 'multi-select') && (
                    <SelectField row={row} index={index} control={form.control} />
                  )}
                  {row.type === 'number' && <NumberField control={form.control} row={row} index={index} />}
                  {row.type === 'slider' && <SliderField control={form.control} row={row} index={index} />}
                  {row.type === 'color' && <ColorField control={form.control} row={row} index={index} />}
                  {row.type === 'time' && <TimeField control={form.control} row={row} index={index} />}
                  {row.type === 'date' || row.type === 'date-range' ? (
                    <DateField control={form.control} row={row} index={index} />
                  ) : null}
                  {row.type === 'textarea' && (
                    <TextareaField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                </React.Fragment>
              );
            })}
            <Group position="right" spacing={8} mt={8}>
              <Button
                className={cx(classes.button, classes.cancelButton)}
                onClick={() => handleClose()}
                disabled={fields.options?.allowCancel === false}
                variant="default"
              >
                {locale.ui.cancel || 'Cancel'}
              </Button>
              <Button className={classes.button} type="submit" variant="default">
                {locale.ui.confirm || 'Confirm'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default InputDialog;
