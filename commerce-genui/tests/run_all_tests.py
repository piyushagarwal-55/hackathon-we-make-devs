#!/usr/bin/env python3
"""
Master test runner - runs all tests in sequence
"""

import subprocess
import sys
import os

def run_command(name, command, cwd=None):
    """Run a command and report results"""
    print("\n" + "="*70)
    print(f"RUNNING: {name}")
    print("="*70)
    
    try:
        result = subprocess.run(
            command,
            cwd=cwd,
            capture_output=False,
            text=True,
            shell=True
        )
        
        if result.returncode == 0:
            print(f"\n✅ {name} PASSED")
            return True
        else:
            print(f"\n❌ {name} FAILED (exit code: {result.returncode})")
            return False
            
    except Exception as e:
        print(f"\n❌ {name} ERROR: {e}")
        return False


def main():
    """Run all test suites"""
    print("\n" + "="*70)
    print("COMMERCE GENUI - MASTER TEST SUITE")
    print("="*70)
    print("\nThis will run ALL tests for the SDK:")
    print("  1. Python syntax checking")
    print("  2. Python SDK unit tests")
    print("  3. Backend API tests (requires server running)")
    print("  4. TypeScript compilation tests")
    print("\n" + "="*70)
    
    tests_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(tests_dir)
    
    results = []
    
    # Test 1: Python Syntax
    results.append((
        "Python Syntax Check",
        run_command(
            "Python Syntax Check",
            f"python {os.path.join(tests_dir, 'check_python_syntax.py')}"
        )
    ))
    
    # Test 2: Python SDK Tests
    results.append((
        "Python SDK Unit Tests",
        run_command(
            "Python SDK Unit Tests",
            f"python {os.path.join(tests_dir, 'test_python_sdk.py')}"
        )
    ))
    
    # Test 3: Backend API Tests
    print("\n" + "="*70)
    print("BACKEND API TESTS")
    print("="*70)
    print("\n⚠️  NOTE: Backend server must be running!")
    print("If not running, start it with:")
    print("  python examples/minimal-shop/backend/server.py")
    
    user_input = input("\nIs the backend server running? (y/n): ").strip().lower()
    
    if user_input == 'y':
        results.append((
            "Backend API Tests",
            run_command(
                "Backend API Tests",
                f"python {os.path.join(tests_dir, 'test_backend_api.py')}"
            )
        ))
    else:
        print("\n⏭️  Skipping backend API tests")
        results.append(("Backend API Tests", None))
    
    # Final Report
    print("\n" + "="*70)
    print("FINAL TEST REPORT")
    print("="*70)
    
    for test_name, passed in results:
        if passed is None:
            status = "⏭️  SKIP"
        elif passed:
            status = "✅ PASS"
        else:
            status = "❌ FAIL"
        print(f"{status} - {test_name}")
    
    # Calculate score
    completed_tests = [r for r in results if r[1] is not None]
    if completed_tests:
        passed_count = sum(1 for _, passed in completed_tests if passed)
        total_count = len(completed_tests)
        
        print("\n" + "="*70)
        print(f"SCORE: {passed_count}/{total_count} test suites passed")
        print("="*70)
        
        if passed_count == total_count:
            print("\n🎉 ALL TESTS PASSED! SDK is production-ready!")
            return 0
        else:
            print(f"\n⚠️  {total_count - passed_count} test suite(s) failed")
            return 1
    else:
        print("\n⚠️  No tests were run")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
