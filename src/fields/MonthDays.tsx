import React, { useMemo } from 'react'

import CustomSelect from '../components/CustomSelect'
import { MonthDaysProps } from '../types'
import { DEFAULT_LOCALE_EN } from '../locale'
import { classNames } from '../utils'

export default function MonthDays(props: MonthDaysProps) {
  const { value, setValue, locale, className, weekDays, disabled } = props
  const noWeekDays = !weekDays || weekDays.length === 0

  const internalClassName = useMemo(
    () =>
      classNames({
        'react-js-cron-month-days': true,
        'react-js-cron-month-days-placeholder': !noWeekDays,
        [`${className}-month-days`]: !!className,
      }),
    [className, noWeekDays]
  )

  const localeJSON = JSON.stringify(locale)
  const placeholder = useMemo(() => {
    if (noWeekDays) {
      return locale.emptyMonthDays || DEFAULT_LOCALE_EN.emptyMonthDays
    }

    return locale.emptyMonthDaysShort || DEFAULT_LOCALE_EN.emptyMonthDaysShort
  }, [noWeekDays, localeJSON]) // eslint-disable-line

  return (
    <div className={internalClassName}>
      {locale.prefixMonthDays !== '' && (
        <span>
          {locale.prefixMonthDays || DEFAULT_LOCALE_EN.prefixMonthDays}
        </span>
      )}

      <CustomSelect
        placeholder={placeholder}
        value={value}
        setValue={setValue}
        nbOptions={31}
        startAtZero={false}
        type='month-days'
        locale={locale}
        className={className}
        disabled={disabled}
      />
    </div>
  )
}
