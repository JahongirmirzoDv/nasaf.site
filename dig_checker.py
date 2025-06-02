#!/usr/bin/env python3

import subprocess
import time
import datetime
import signal
import sys

def execute_dig_command():
    """Execute the dig command and return its output"""
    try:
        # Execute the dig command
        process = subprocess.run(
            ["dig", "nasaf.com.uz", "TXT", "+short"],
            capture_output=True,
            text=True,
            check=True
        )
        
        # Get the current timestamp
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Print the timestamp and command output
        print(f"\n--- TXT Record Check at {timestamp} ---")
        
        if process.stdout.strip():
            print(process.stdout.strip())
        else:
            print("No TXT records found")
            
        return True
    except subprocess.CalledProcessError as e:
        print(f"Command failed with return code {e.returncode}")
        print(f"Error output: {e.stderr}")
        return False
    except Exception as e:
        print(f"Error executing dig command: {str(e)}")
        return False

def signal_handler(sig, frame):
    """Handle Ctrl+C to ensure graceful shutdown"""
    print("\nShutting down...")
    sys.exit(0)

def main():
    """Main function to run the dig command in a loop"""
    # Register the signal handler for Ctrl+C (SIGINT)
    signal.signal(signal.SIGINT, signal_handler)
    
    print("Starting DNS TXT record checker for nasaf.com.uz")
    print("Press Ctrl+C to exit")
    
    try:
        while True:
            execute_dig_command()
            time.sleep(10)  # Sleep for 10 seconds
    except Exception as e:
        print(f"Unexpected error in main loop: {str(e)}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())

