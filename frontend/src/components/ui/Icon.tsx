interface IconProps {
  name: string
  size?: number
}

const paths: Record<string, string> = {
  search: 'M11 19a8 8 0 1 1 5.657-13.657A8 8 0 0 1 11 19Zm0-14a6 6 0 1 0 4.243 10.243A6 6 0 0 0 11 5Zm5.5 10.5 4 4',
  upload: 'M12 16V4m0 0L7 9m5-5 5 5M5 20h14',
  download: 'M12 4v11m0 0 5-5m-5 5-5-5M5 20h14',
  trash: 'M4 7h16m-10 4v5m4-5v5M9 7V4h6v3m-9 0 1 13h10l1-13',
  file: 'M6 3h8l4 4v14H6V3Zm8 0v5h4',
  image: 'M5 4h14v16H5V4Zm2 12 3-3 2 2 2-3 3 4M9 9h.01',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  grid: 'M5 5h5v5H5V5Zm9 0h5v5h-5V5ZM5 14h5v5H5v-5Zm9 0h5v5h-5v-5Z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'm6 6 12 12M18 6 6 18',
  check: 'm5 12 4 4L19 6',
}

export function Icon({ name, size = 18 }: IconProps) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name] ?? paths.file} />
    </svg>
  )
}
