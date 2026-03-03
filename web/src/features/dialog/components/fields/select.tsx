import { createStyles, MultiSelect, Select } from '@mantine/core';
import { ISelect } from '../../../../typings';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: ISelect;
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
      borderColor: 'rgba(255, 163, 233, 0.5)',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 163, 233, 0.4)',
    },
    '&::placeholder': {
      color: 'rgba(255, 163, 233, 0.2)',
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
    padding: 4,
  },
  item: {
    color: '#fff3fc',
    borderRadius: 4,
    transition: 'all 0.2s ease',
    '&[data-selected]': {
      backgroundColor: 'rgba(255, 163, 233, 0.15)',
      color: '#ffa3e9',
      '&:hover': {
        backgroundColor: 'rgba(255, 163, 233, 0.2)',
      },
    },
    '&[data-hovered]': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      color: '#fff',
    },
  },
  value: {
    backgroundColor: 'rgba(255, 163, 233, 0.15)',
    color: '#ffa3e9',
    border: '1px solid rgba(255, 163, 233, 0.2)',
    fontWeight: 500,
  },
}));

const SelectField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required },
  });
  const { classes } = useStyles();

  return (
    <>
      {props.row.type === 'select' ? (
        <Select
          data={props.row.options}
          value={controller.field.value}
          name={controller.field.name}
          ref={controller.field.ref}
          onBlur={controller.field.onBlur}
          onChange={controller.field.onChange}
          disabled={props.row.disabled}
          label={props.row.label}
          description={props.row.description}
          withAsterisk={props.row.required}
          clearable={props.row.clearable}
          searchable={props.row.searchable}
          icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
          classNames={{
            input: classes.input,
            label: classes.label,
            dropdown: classes.dropdown,
            item: classes.item,
          }}
          variant="filled"
        />
      ) : (
        <>
          {props.row.type === 'multi-select' && (
            <MultiSelect
              data={props.row.options}
              value={controller.field.value}
              name={controller.field.name}
              ref={controller.field.ref}
              onBlur={controller.field.onBlur}
              onChange={controller.field.onChange}
              disabled={props.row.disabled}
              label={props.row.label}
              description={props.row.description}
              withAsterisk={props.row.required}
              clearable={props.row.clearable}
              searchable={props.row.searchable}
              maxSelectedValues={props.row.maxSelectedValues}
              icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
              classNames={{
                input: classes.input,
                label: classes.label,
                dropdown: classes.dropdown,
                item: classes.item,
                value: classes.value,
              }}
              variant="filled"
            />
          )}
        </>
      )}
    </>
  );
};

export default SelectField;
