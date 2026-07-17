import { test, expect } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
})

test('legal pages load', async ({ page }) => {
  await page.goto('/terminos')
  await expect(page.locator('h1')).toContainText('Términos')

  await page.goto('/privacidad')
  await expect(page.locator('h1')).toContainText('Privacidad')
})
