const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({page, request}) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'superuser',
                username: 'root',
                password: 'china'
            }
        })
        await request.post('/api/users', {
            data: {
                name: 'bob',
                username: 'bobo',
                password: 'china'
            }
        })
        await page.goto('/')
    })

    test('Login form is shown', async ({page}) => {
        await expect(page.getByText('log in to application')).toBeVisible()
        await expect(page.getByLabel('username')).toBeVisible()
        await expect(page.getByLabel('password')).toBeVisible()
        await expect(page.getByText('login')).toBeVisible()
    })
    
    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByLabel('username').fill('root')
            await page.getByLabel('password').fill('china')
            await page.getByRole('button', { name: 'login '}).click()
            await expect(page.getByText('superuser logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByLabel('username').fill('root')
            await page.getByLabel('password').fill('wrong')
            await page.getByRole('button', { name: 'login '}).click()
            const errorDiv = page.locator('.error')
            await expect(errorDiv).toContainText('Wrong username or password')
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({page}) => {
            await page.getByLabel('username').fill('root')
            await page.getByLabel('password').fill('china')
            await page.getByRole('button', { name: 'login'}).click()
        })

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog' }).click()
            await page.getByLabel('title:').fill('created by playwright')
            await page.getByLabel('author:').fill('playwright')
            await page.getByLabel('url:').fill('https://www.google.com/')
            await page.getByRole('button', { name: 'create' }).click()
            await expect(page.getByText('created by playwright', {exact: true})).toBeVisible()
            await expect(page.getByText('playwright', {exact: true})).toBeVisible()
        })

        describe('and a blog created', () => {
            beforeEach(async ({page}) => {
                await page.getByRole('button', { name: 'create new blog' }).click()
                await page.getByLabel('title:').fill('created by playwright')
                await page.getByLabel('author:').fill('playwright')
                await page.getByLabel('url:').fill('https://www.google.com/')
                await page.getByRole('button', { name: 'create' }).click()
            })

            test("like counter increased", async ({page}) => {
                await page.getByRole('button', { name: 'view' }).click()
                await page.getByRole('button', { name: 'like' }).click()
                await expect(page.getByText('1')).toBeVisible()
            })

            test("can delete blog", async ({page}) => {
                await page.getByRole('button', { name: 'view' }).click()
                page.once('dialog', async dialog => {
                    await dialog.accept()
                })
                await page.getByRole('button', { name: 'remove' }).click()
                await expect(page.getByText('created by playwright', {exact: true})).not.toBeVisible()
                await expect(page.getByText('playwright', {exact: true})).not.toBeVisible()
            })

            test("cannot delete with wrong user", async ({page}) => {
                await page.getByRole('button', { name: 'logout' }).click()
                await page.getByLabel('username').fill('bobo')
                await page.getByLabel('password').fill('china')
                await page.getByRole('button', { name: 'login'}).click()
                await page.getByRole('button', { name: 'view' }).click()
                await expect(page.getByRole('button', {name : 'remove'})).not.toBeVisible()
            })

            test("proper ordering", async ({page}) => {
                await page.getByRole('button', { name: 'create new blog' }).click()
                await page.getByLabel('title:').fill('blog2')
                await page.getByLabel('author:').fill('john choob')
                await page.getByLabel('url:').fill('https://www.google.com/')
                await page.getByRole('button', { name: 'create' }).click()
                const otherBlogText = page.getByText('blog2', {exact: true})
                const otherBlogElement = otherBlogText.locator('..')
                await otherBlogElement.getByRole('button', { name: 'view' }).click()
                await otherBlogElement.getByRole('button', { name: 'like' }).click()
                await expect(page.getByText('1')).toBeVisible()
                await otherBlogElement.getByRole('button', { name: 'hide' }).click()
                
                const viewButtons = await page.getByRole('button', { name: 'view' }).all()
                await expect(viewButtons[0].locator('..').getByText('blog2')).toBeVisible()
                await expect(viewButtons[1].locator('..').getByText('created by playwright')).toBeVisible()
            })
        })
    })
})