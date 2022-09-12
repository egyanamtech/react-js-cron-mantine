import React, { useMemo } from 'react'

import CustomSelect from '../components/CustomSelect'
import { MonthDaysProps } from '../types'
import { DEFAULT_LOCALE_EN } from '../locale'
import { classNames } from '../utils'
import { UNITS } from '../constants'
import { Group } from '@mantine/core'

export default function MonthDays(props: MonthDaysProps) {
  const {
    value,
    setValue,
    locale,
    className,
    weekDays,
    disabled,
    readOnly,
    leadingZero,
    period,
    periodicityOnDoubleClick,
    mode,
  } = props
  const noWeekDays = !weekDays || weekDays.length === 0

  const internalClassName = useMemo(
    () =>
      classNames({
        'react-js-cron-field': true,
        'react-js-cron-month-days': true,
        'react-js-cron-month-days-placeholder': !noWeekDays,
        [`${className}-field`]: !!className,
        [`${className}-month-days`]: !!className,
      }),
    [className, noWeekDays]
  )

  const localeJSON = JSON.stringify(locale)
  const placeholder = useMemo(
    () => {
      if (noWeekDays) {
        return locale.emptyMonthDays || DEFAULT_LOCALE_EN.emptyMonthDays
      }

      return locale.emptyMonthDaysShort || DEFAULT_LOCALE_EN.emptyMonthDaysShort
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [noWeekDays, localeJSON]
  )

  const displayMonthDays =
    !readOnly ||
    (value && value.length > 0) ||
    ((!value || value.length === 0) && (!weekDays || weekDays.length === 0))

  return displayMonthDays ? (
    <div
      style={{ display: 'flex', alignItems: 'baseline' }}
      // className={internalClassName}
    >
      <CustomSelect
        labelText={
          locale.prefixMonthDays !== '' &&
          (locale.prefixMonthDays || DEFAULT_LOCALE_EN.prefixMonthDays)
        }
        placeholder={placeholder}
        value={value}
        setValue={setValue}
        unit={UNITS[2]}
        locale={locale}
        className={className}
        disabled={disabled}
        readOnly={readOnly}
        leadingZero={leadingZero}
        period={period}
        periodicityOnDoubleClick={periodicityOnDoubleClick}
        mode={mode}
      />
    </div>
  ) : null
}
