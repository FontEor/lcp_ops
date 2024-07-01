// Filter for article status
export const articleStatusFilter = (status: string) => {
  const statusMap: { [key: string]: string } = {
    published: 'success',
    draft: 'info',
    deleted: 'danger'
  }
  return statusMap[status]
}

// 让第一个字母大写
export const uppercaseFirstChar = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
