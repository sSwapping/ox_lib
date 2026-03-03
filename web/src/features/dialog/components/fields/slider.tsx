import { Box, createStyles, Slider, Text } from '@mantine/core';
import { ISlider } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';

interface Props {
  row: ISlider;
  index: number;
  control: Control<FormValues>;
}

const useStyles = createStyles((theme) => ({
  track: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  bar: {
    backgroundColor: '#ffa3e9',
  },
  thumb: {
    borderColor: '#ffa3e9',
    backgroundColor: '#141414',
    borderWidth: 2,
  },
  mark: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  markLabel: {
    color: theme.colors.gray[5],
    marginTop: 8,
  },
  label: {
    color: theme.colors.gray[4],
    fontWeight: 500,
    fontSize: 14,
    marginBottom: 8,
  },
}));

const SliderField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    defaultValue: props.row.default || props.row.min || 0,
  });
  const { classes } = useStyles();

  return (
    <Box>
      <Text className={classes.label}>{props.row.label}</Text>
      <Slider
        mb={24}
        mt={10}
        value={controller.field.value}
        name={controller.field.name}
        ref={controller.field.ref}
        onBlur={controller.field.onBlur}
        onChange={controller.field.onChange}
        defaultValue={props.row.default || props.row.min || 0}
        min={props.row.min}
        max={props.row.max}
        step={props.row.step}
        disabled={props.row.disabled}
        marks={[
          { value: props.row.min || 0, label: props.row.min || 0 },
          { value: props.row.max || 100, label: props.row.max || 100 },
        ]}
        classNames={{
          track: classes.track,
          bar: classes.bar,
          thumb: classes.thumb,
          mark: classes.mark,
          markLabel: classes.markLabel,
        }}
        size="md"
        radius="xl"
      />
    </Box>
  );
};

export default SliderField;
