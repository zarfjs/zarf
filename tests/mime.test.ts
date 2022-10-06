import { describe, expect, it } from "bun:test";
import { getMimeType, getContentType, getMimeExt } from '../src/core/utils/mime'

describe('mime', () => {
    describe('getMimeType', () => {
        it('.txt should return text/plain', () => {
            expect(getMimeType('.txt')).toBe('text/plain')
        })
        it('txt should return text/plain', () => {
            expect(getMimeType('txt')).toBe('text/plain')
        })
        it('file.txt should return text/plain', () => {
            expect(getMimeType('file.txt')).toBe('text/plain')
        })
        it('.text should return text/plain', () => {
            expect(getMimeType('text')).toBe('text/plain')
        })
        it('unknown string should return a falsy value', () => {
            expect(getMimeType('lorem')).toBe(false)
        })
        it('unknown paths should return a falsy value', () => {
            expect(getMimeType('lorem/ipsum')).toBe(false)
        })
    })
    describe('getContentType', () => {
        it('.txt should return text/plain with correct charset', () => {
            expect(getContentType('txt')).toBe('text/plain; charset=utf-8')
        })
    })
    describe('getMimeExt', () => {
        it('text/plain should return txt', () => {
            expect(getMimeExt('text/plain')).toBe('txt')
            expect(getMimeExt('text/html')).toBe('html')
            expect(getMimeExt('application/json')).toBe('json')

        })
        it('text/unknown should return false', () => {
            expect(getMimeExt('text/unknown')).toBe(false)
        })
    })
})
