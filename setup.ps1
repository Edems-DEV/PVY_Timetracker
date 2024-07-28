# Function to check if a command exists
function Test-Command {
    param (
        [string]$command
    )
    $result = $null
    try {
        $result = Get-Command $command -ErrorAction Stop
    } catch {
        $result = $null
    }
    return $result
}

# Check if Git is installed
if (-not (Test-Command "git")) {
    Write-Output "Git is not installed."
    Write-Output "Download Git:"
    Write-Output "- https://git-scm.com/downloads"
    Write-Output "OR"
    Write-Output "- `winget install -e --id Git.Git` "
} else {
    Write-Output "Git is installed."
}


# Set repository name
$name = "PVY_Timetracker"

# Clone the repository
if (Test-Command "git") {
    Write-Output "Cloning the repository..."
    git clone "https://github.com/Edems-DEV/$name.git"

    # Navigate into the repository
    Set-Location -Path $name

} else {
    Write-Output "Git command not found. Please install Git to proceed."
}


# Open browser to localhost:4200
Start-Process "index.html"

Write-Output "Setup script execution completed."