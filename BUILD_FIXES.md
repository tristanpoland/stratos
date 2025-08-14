# Stratos Build Fixes Documentation

This document tracks all the changes made to fix build errors and what features are temporarily disabled.

## Fixed Import Issues

### 1. rxjs-spy Import Paths
**Files changed:**
- `src/frontend/packages/cloud-foundry/src/shared/components/list/list-types/app/cf-apps-data-source.ts:4`
- `src/frontend/packages/core/src/shared/components/list/data-sources-controllers/local-list-controller.ts:3`

**Change:** Updated import paths from `rxjs-spy/operators/tag` to `rxjs-spy/operators`
**Status:** ✅ **FIXED** - These imports now work correctly

### 2. ts-md5 Import Path
**File changed:**
- `src/frontend/packages/git/src/shared/scm/gitlab-scm.ts:4`

**Change:** Updated import from `ts-md5/dist/md5` to `ts-md5`
**Status:** ✅ **FIXED** - Import now works correctly

## Temporarily Disabled Features

### 3. Custom SASS Handler
**File:** `src/frontend/packages/devkit/src/build/sass.ts`
**Issue:** SASS implementation render function incompatibility with newer SASS versions
**Status:** ⚠️ **TEMPORARILY DISABLED**
**Impact:** Custom theme imports (`~@stratosui/theme`) will not work
**Lines disabled:** 30-41

### 4. Angular Material Theming
**Files affected:** Multiple theme files across the project
**Issue:** Angular Material theming imports causing build failures
**Status:** ⚠️ **TEMPORARILY DISABLED**
**Impact:** Angular Material components will not have proper theming

**Specific changes:**
- **Core theme file:** `src/frontend/packages/core/sass/theme.scss`
  - Disabled Angular Material theming import (line 2)
  - Disabled `~@stratosui/theme` import (line 7)  
  - Disabled `~@stratosui/theme/extensions` import (line 25)
  - Disabled `angular-material-theme` mixins (lines 77, 87)
  - Disabled `app-theme` mixins (lines 78, 87)
  - Disabled `apply-theme` mixins (lines 80, 89)
  - Disabled `mat-core` mixin (line 93)
  - Added comprehensive fallback `stratos-theme` function (lines 13-48)

- **All-theme file:** `src/frontend/packages/core/sass/_all-theme.scss`
  - Disabled `steppers-theme` mixin (line 88)
  - Disabled `app-log-viewer-theme` mixin (line 102)

- **Component theme files:** Applied to ~20 component theme files
  - Replaced `@import '@angular/material/theming';` with commented versions
  - Added fallback `mat-color` function in `_all-theme.scss` (lines 2-7)

### 5. Mappy-Breakpoints Import
**File:** `src/frontend/packages/kubernetes/src/helm/theme.scss`
**Issue:** Import path resolution issues with `~mappy-breakpoints/mappy-breakpoints`
**Status:** ⚠️ **TEMPORARILY DISABLED**
**Impact:** Responsive breakpoint mixins use fallback implementation
**Lines:** 44-45 (import), 47-59 (fallback mixin)

### 6. Kubernetes Theme Variables
**File:** `src/frontend/packages/kubernetes/src/helm/theme.scss`
**Status:** ✅ **FIXED** - Added fallback variables
**Added variables:**
- `$monocular-app-primary: $color-base;` (line 8)
- `$monocular-app-accent: #00bcd4;` (line 9)
- `$monocular-app-warn: #f44336;` (line 10)

### 7. Angular CLI Configuration Update
**File:** `angular.json`
**Issue:** Schema validation error - Angular 20 expects `buildTarget` instead of `browserTarget`
**Status:** ✅ **FIXED**
**Impact:** `npm run start` now works properly
**Changes:**
- Updated serve configuration `browserTarget` to `buildTarget` (lines 98, 102, 105)
- Updated extract-i18n configuration `browserTarget` to `buildTarget` (line 112)

## Build Status
- ✅ **Build now completes successfully** (83 seconds, all bundles generated)
- ⚠️ **Only warnings remain** (CommonJS optimization warnings - non-blocking)
- ❌ **Theming system temporarily disabled** (application will work but with minimal styling)

## Next Steps to Restore Full Functionality

1. **Fix SASS Handler Compatibility:**
   - Update SASS handler to work with modern SASS API (v1.89+)
   - Ensure proper importer function compatibility
   - Test with both sass-loader v13 and v16

2. **Restore Angular Material Theming:**
   - Update Angular Material theming to v20 API
   - Fix import paths and function calls
   - Test theme compilation

3. **Fix Custom Theme Imports:**
   - Resolve `~@stratosui/theme` import issues
   - Ensure custom theme resolution works
   - Test theme extension system

4. **Restore Mappy-Breakpoints:**
   - Fix import path resolution for `~mappy-breakpoints`
   - Test responsive breakpoint functionality

## Warnings

**Do not modify these files without understanding the impact:**
- The fallback functions and variables are critical for build success
- Removing "Temporarily disabled" comments may break the build
- The SASS handler changes affect the entire theming system

**Testing Required:**
- Full regression testing needed after restoring any disabled feature
- Theme functionality testing
- Responsive design testing