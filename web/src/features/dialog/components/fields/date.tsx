import { IDateInput } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import { DatePicker, DateRangePicker } from '@mantine/dates';
import { createStyles } from '@mantine/core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: IDateInput;
  index: number;
  control: Control<FormValues>;
}

const useStyles = createStyles((theme) => ({
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff3fc',
    borderRadius: 6,
    transition: 'all 0.2s ease',
    '&:focus': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 163, 233, 0.4)',
    },
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.2)',
    },
  },
  label: {
    color: theme.colors.gray[4],
    fontWeight: 500,
    fontSize: 14,
    marginBottom: 4,
  },
  dropdown: {
    backgroundColor: '#1a1a1a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    borderRadius: 6,
    padding: 10,
  },
  calendarHeader: {
    color: '#fff3fc',
  },
  calendarHeaderControl: {
    color: theme.colors.gray[4],
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
    },
  },
  day: {
    color: '#fff3fc',
    borderRadius: 4,
    '&[data-weekend]': {
      color: theme.colors.red[3],
    },
    '&[data-outside]': {
      color: 'rgba(255, 255, 255, 0.2)',
    },
    '&[data-selected]': {
      backgroundColor: '#ffa3e9',
      color: '#141414',
      fontWeight: 600,
      '&:hover': {
        backgroundColor: '#ffb3ee',
      },
    },
    '&[data-in-range]': {
      backgroundColor: 'rgba(255, 163, 233, 0.2)',
      color: '#ffa3e9',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  month: {
    '&[data-selected]': {
      backgroundColor: '#ffa3e9',
      color: '#141414',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  year: {
    '&[data-selected]': {
      backgroundColor: '#ffa3e9',
      color: '#141414',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
}));

const DateField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required, min: props.row.min, max: props.row.max },
  });
  const { classes } = useStyles();

  return (
    <>
      {props.row.type === 'date' && (
        <DatePicker
          value={controller.field.value ? new Date(controller.field.value) : controller.field.value}
          name={controller.field.name}
          ref={controller.field.ref}
          onBlur={controller.field.onBlur}
          // Workaround to use timestamp instead of Date object in values
          onChange={(date) => controller.field.onChange(date ? date.getTime() : null)}
          label={props.row.label}
          description={props.row.description}
          placeholder={props.row.format}
          disabled={props.row.disabled}
          inputFormat={props.row.format}
          withAsterisk={props.row.required}
          clearable={props.row.clearable}
          icon={props.row.icon && <LibIcon fixedWidth icon={props.row.icon} />}
          minDate={props.row.min ? new Date(props.row.min) : undefined}
          maxDate={props.row.max ? new Date(props.row.max) : undefined}
          classNames={{
            input: classes.input,
            label: classes.label,
            dropdown: classes.dropdown,
            calendarHeader: classes.calendarHeader,
            calendarHeaderControl: classes.calendarHeaderControl,
            day: classes.day,
            month: classes.month,
          }}
          variant="filled"
        />
      )}
      {props.row.type === 'date-range' && (
        <DateRangePicker
          value={
            controller.field.value
              ? controller.field.value[0]
                ? controller.field.value.map((date: Date) => new Date(date))
                : controller.field.value
              : controller.field.value
          }
          name={controller.field.name}
          ref={controller.field.ref}
          onBlur={controller.field.onBlur}
          onChange={(dates) =>
            controller.field.onChange(dates.map((date: Date | null) => (date ? date.getTime() : null)))
          }
          label={props.row.label}
          description={props.row.description}
          placeholder={props.row.format}
          disabled={props.row.disabled}
          inputFormat={props.row.format}
          withAsterisk={props.row.required}
          clearable={props.row.clearable}
          icon={props.row.icon && <LibIcon fixedWidth icon={props.row.icon} />}
          minDate={props.row.min ? new Date(props.row.min) : undefined}
          maxDate={props.row.max ? new Date(props.row.max) : undefined}
          classNames={{
            input: classes.input,
            label: classes.label,
            dropdown: classes.dropdown,
            calendarHeader: classes.calendarHeader,
            calendarHeaderControl: classes.calendarHeaderControl,
            day: classes.day,
            month: classes.month,
          }}
          variant="filled"
        />
      )}
    </>
  );
};

export default DateField;
