import React, { useMemo } from 'react'

import CustomSelect from '../components/CustomSelect'
import { HoursProps } from '../types'
import { DEFAULT_LOCALE_EN } from '../locale'
import { classNames } from '../utils'
import { UNITS } from '../constants'
import { Group } from '@mantine/core'

export default function Hours(props: HoursProps) {
  const {
    value,
    setValue,
    locale,
    className,
    disabled,
    readOnly,
    leadingZero,
    clockFormat,
    period,
    periodicityOnDoubleClick,
    mode,
  } = props
  const internalClassName = useMemo(
    () =>
      classNames({
        'react-js-cron-field': true,
        'react-js-cron-hours': true,
        [`${className}-field`]: !!className,
        [`${className}-hours`]: !!className,
      }),
    [className]
  )

  return (
    // <div className={internalClassName}>
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
      <CustomSelect
        labelText={
          locale.prefixHours !== '' &&
          (locale.prefixHours || DEFAULT_LOCALE_EN.prefixHours)
        }
        placeholder={locale.emptyHours || DEFAULT_LOCALE_EN.emptyHours}
        value={value}
        unit={UNITS[1]}
        setValue={setValue}
        locale={locale}
        className={className}
        disabled={disabled}
        readOnly={readOnly}
        leadingZero={leadingZero}
        clockFormat={clockFormat}
        period={period}
        periodicityOnDoubleClick={periodicityOnDoubleClick}
        mode={mode}
      />
    </div>
    // </div>
  )
}
