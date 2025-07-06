// Theme validation utility for development and debugging
export const validateThemeConsistency = () => {
  const issues = [];
  const warnings = [];
  const suggestions = [];

  // Check for hardcoded colors in style attributes
  const elementsWithHardcodedColors = document.querySelectorAll(
    '[style*="color:"], [style*="background:"], [style*="border-color:"]'
  );

  if (elementsWithHardcodedColors.length > 0) {
    issues.push(
      `Found ${elementsWithHardcodedColors.length} elements with hardcoded colors in style attributes`
    );

    // Log specific elements for debugging
    elementsWithHardcodedColors.forEach((el, index) => {
      if (index < 5) {
        // Limit to first 5 for readability
        console.warn(`Hardcoded color element ${index + 1}:`, el);
      }
    });
  }

  // Check for missing CSS variables
  const requiredVariables = [
    "--nexus-bg-primary",
    "--nexus-bg-secondary",
    "--nexus-bg-tertiary",
    "--nexus-text-primary",
    "--nexus-text-secondary",
    "--nexus-border",
    "--nexus-primary",
    "--nexus-secondary",
    "--nexus-shadow",
  ];

  const rootStyles = getComputedStyle(document.documentElement);
  const missingVariables = [];

  requiredVariables.forEach((variable) => {
    const value = rootStyles.getPropertyValue(variable);
    if (!value || value.trim() === "") {
      missingVariables.push(variable);
    }
  });

  if (missingVariables.length > 0) {
    issues.push(`Missing CSS variables: ${missingVariables.join(", ")}`);
  }

  // Check Bootstrap theme attribute
  const themeAttribute = document.documentElement.getAttribute("data-bs-theme");
  if (!themeAttribute) {
    issues.push("Missing data-bs-theme attribute on document element");
  } else if (!["light", "dark"].includes(themeAttribute)) {
    issues.push(`Invalid theme attribute value: ${themeAttribute}`);
  }

  // Check for elements that might not be themed properly
  const commonElements = {
    cards: document.querySelectorAll(".card"),
    buttons: document.querySelectorAll(".btn"),
    forms: document.querySelectorAll(".form-control"),
    modals: document.querySelectorAll(".modal-content"),
    navbars: document.querySelectorAll(".navbar"),
    footers: document.querySelectorAll("footer"),
  };

  Object.entries(commonElements).forEach(([elementType, elements]) => {
    if (elements.length === 0) {
      warnings.push(`No ${elementType} found on current page`);
    } else {
      suggestions.push(
        `${elements.length} ${elementType} detected and should be themed`
      );
    }
  });

  // Check for potential CSS conflicts
  const conflictingClasses = document.querySelectorAll(
    ".bg-white, .bg-dark, .text-white, .text-dark"
  );

  if (conflictingClasses.length > 0) {
    warnings.push(
      `Found ${conflictingClasses.length} elements with potential Bootstrap color conflicts`
    );
  }

  // Check transition performance
  const elementsWithTransitions = document.querySelectorAll(
    '[style*="transition"], .card, .btn, .navbar-custom'
  );
  if (elementsWithTransitions.length > 100) {
    warnings.push(
      `High number of elements with transitions (${elementsWithTransitions.length}) may impact performance`
    );
  }

  // Check for accessibility
  const focusableElements = document.querySelectorAll(
    "button, input, select, textarea, a[href]"
  );
  let elementsWithoutFocusStyles = 0;

  focusableElements.forEach((el) => {
    const styles = getComputedStyle(el);
    if (
      !styles.getPropertyValue("outline") &&
      !styles.getPropertyValue("box-shadow")
    ) {
      elementsWithoutFocusStyles++;
    }
  });

  if (elementsWithoutFocusStyles > 0) {
    warnings.push(
      `${elementsWithoutFocusStyles} focusable elements may lack proper focus indicators`
    );
  }

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    theme: themeAttribute,
    issues: issues,
    warnings: warnings,
    suggestions: suggestions,
    summary: {
      totalIssues: issues.length,
      totalWarnings: warnings.length,
      overallStatus: issues.length === 0 ? "PASS" : "FAIL",
    },
  };

  // Console output
  if (report.summary.overallStatus === "PASS") {
    console.log("✅ Theme validation PASSED - all components properly themed");

    if (warnings.length > 0) {
      console.warn("⚠️ Warnings found:", warnings);
    }

    if (suggestions.length > 0) {
      console.info("💡 Suggestions:", suggestions);
    }
  } else {
    console.error("❌ Theme validation FAILED");
    console.error("🐛 Issues found:", issues);

    if (warnings.length > 0) {
      console.warn("⚠️ Additional warnings:", warnings);
    }
  }

  // Store validation results for debugging
  if (typeof window !== "undefined") {
    window.themeValidationReport = report;
    sessionStorage.setItem("themeValidationReport", JSON.stringify(report));
  }

  return report;
};

// Performance monitoring for theme switches
export const measureThemePerformance = (callback) => {
  const startTime = performance.now();

  const observer = new MutationObserver((mutations) => {
    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`🔄 Theme switch performance: ${duration.toFixed(2)}ms`);

    if (duration > 100) {
      console.warn("⚠️ Theme switch took longer than expected (>100ms)");
    }

    observer.disconnect();

    if (callback) callback(duration);
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-bs-theme"],
  });

  return observer;
};

// Utility to check contrast ratios (accessibility)
export const checkContrastRatio = (foreground, background) => {
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Calculate relative luminance
  const getLuminance = (rgb) => {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) return null;

  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);

  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio: ratio,
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    level: ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : "FAIL",
  };
};

// Development helper functions
if (process.env.NODE_ENV === "development") {
  // Make functions available globally for debugging
  window.validateTheme = validateThemeConsistency;
  window.measureThemePerformance = measureThemePerformance;
  window.checkContrastRatio = checkContrastRatio;

  // Auto-validate on theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-bs-theme"
      ) {
        setTimeout(() => {
          validateThemeConsistency();
        }, 100);
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-bs-theme"],
  });
}
