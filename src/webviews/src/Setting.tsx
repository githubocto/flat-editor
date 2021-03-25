import React, { FunctionComponent } from 'react'

type SettingProps = {
  title: string
}

const Setting: FunctionComponent<SettingProps> = props => {
  return (
    <div className="flex flex-row">
      <div>{props.title}</div>{' '}
      <div className="flex-1">
        <input type="text"></input>
      </div>
    </div>
  )
}

export default Setting
