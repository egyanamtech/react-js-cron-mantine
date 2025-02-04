import React, { useMemo } from 'react'

import { MonthsProps } from '../types'
import CustomSelect from '../components/CustomSelect'
import { DEFAULT_LOCALE_EN } from '../locale'
import { classNames } from '../utils'
import { UNITS } from '../constants'
import { Group } from '@mantine/core'

export default function Months(props: MonthsProps) {
  const {
    value,
    setValue,
    locale,
    className,
    humanizeLabels,
    disabled,
    readOnly,
    period,
    periodicityOnDoubleClick,
    mode,
  } = props
  const optionsList = locale.months || DEFAULT_LOCALE_EN.months

  const internalClassName = useMemo(
    () =>
      classNames({
        'react-js-cron-field': true,
        'react-js-cron-months': true,
        [`${className}-field`]: !!className,
        [`${className}-months`]: !!className,
      }),
    [className]
  )

  return (
    <Group align='baseline' noWrap>
      {/* {locale.prefixMonths !== '' && (
        <span style={{ marginRight: '5px' }}>
          {locale.prefixMonths || DEFAULT_LOCALE_EN.prefixMonths}
        </span>
      )} */}

      <CustomSelect
        labelText={
          locale.prefixMonths !== '' &&
          (locale.prefixMonths || DEFAULT_LOCALE_EN.prefixMonths)
        }
        placeholder={locale.emptyMonths || DEFAULT_LOCALE_EN.emptyMonths}
        optionsList={optionsList}
        grid={false}
        value={value}
        unit={{
          ...UNITS[3],
          // Allow translation of alternative labels when using "humanizeLabels"
          // Issue #3
          alt: locale.altMonths || DEFAULT_LOCALE_EN.altMonths,
        }}
        setValue={setValue}
        locale={locale}
        className={className}
        humanizeLabels={humanizeLabels}
        disabled={disabled}
        readOnly={readOnly}
        period={period}
        periodicityOnDoubleClick={periodicityOnDoubleClick}
        mode={mode}
      />
    </Group>
  )
}
